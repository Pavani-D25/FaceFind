
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { 
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
//   updateProfile
// } from 'firebase/auth';
// import { auth } from '../firebase/config';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import { db } from '../firebase/config';
// import { faceService } from '../services/faceService';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error('useAuth must be used within AuthProvider');
//   return context;
// };

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Better image compression - don't compress too much for face recognition
//   const compressImage = (base64String, maxWidth = 400, quality = 0.8) => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.src = base64String;
      
//       img.onload = () => {
//         let width = img.width;
//         let height = img.height;
        
//         // Don't compress too much - faces need detail
//         if (width > maxWidth) {
//           height = (height * maxWidth) / width;
//           width = maxWidth;
//         }
        
//         // Ensure minimum size for face detection
//         if (width < 200) {
//           width = 200;
//           height = (img.height * 200) / img.width;
//         }
        
//         const canvas = document.createElement('canvas');
//         canvas.width = width;
//         canvas.height = height;
        
//         const ctx = canvas.getContext('2d');
//         ctx.drawImage(img, 0, 0, width, height);
        
//         const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
//         console.log('Image compressed:', {
//           original: { width: img.width, height: img.height },
//           compressed: { width, height }
//         });
//         resolve(compressedBase64);
//       };
      
//       img.onerror = (error) => {
//         reject(error);
//       };
//     });
//   };

//   // Validate image size and type
//   const validateImage = (file) => {
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
//     if (!allowedTypes.includes(file.type)) {
//       throw new Error('Please select a valid image file (JPEG, PNG, GIF)');
//     }
    
//     if (file.size > maxSize) {
//       throw new Error('Image size should be less than 5MB');
//     }
    
//     return true;
//   };

//   // Convert file to Base64
//   const fileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result);
//       reader.onerror = error => reject(error);
//     });
//   };

//   // Sign up with email and password
//   const signup = async (name, email, password, profileFile = null) => {
//     setLoading(true);
//     try {
//       let profilePhotoUrl = null;
      
//       // Process profile photo if provided
//       if (profileFile) {
//         validateImage(profileFile);
//         const base64String = await fileToBase64(profileFile);
//         const compressedPhoto = await compressImage(base64String);
        
//         // Store in Firestore instead of using as photoURL
//         profilePhotoUrl = compressedPhoto;
//       }

//       // Create user in Firebase Auth WITHOUT photoURL
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Update profile with display name only (no photoURL)
//       await updateProfile(user, {
//         displayName: name,
//       });

//       // Create user document in Firestore WITH profile photo
//       const userData = {
//         uid: user.uid,
//         name: name,
//         email: email,
//         profilePhoto: profilePhotoUrl, // Store Base64 here
//         plan: 'free',
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       await setDoc(doc(db, 'users', user.uid), userData);

//       // Register face if profile photo provided
//       if (profilePhotoUrl) {
//         try {
//           console.log('Registering user face with profile photo...');
//           await faceService.registerUserFace(user.uid, profilePhotoUrl);
//           console.log('Face registration completed');
//         } catch (faceError) {
//           console.warn('Face registration failed, but user account created:', faceError);
//           // Don't throw error - user account should still be created
//         }
//       }

//       // Update local state
//       setUser(userData);

//       return user;
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login with email and password
//   const login = async (email, password) => {
//     setLoading(true);
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
      
//       // Get additional user data from Firestore
//       const userDoc = await getDoc(doc(db, 'users', user.uid));
      
//       if (userDoc.exists()) {
//         const userData = userDoc.data();
//         setUser({
//           uid: user.uid,
//           email: user.email,
//           name: userData.name || user.displayName,
//           profilePhoto: userData.profilePhoto || user.photoURL,
//           plan: userData.plan || 'free'
//         });
//       } else {
//         // Create user document if it doesn't exist (for legacy users)
//         const userData = {
//           uid: user.uid,
//           name: user.displayName,
//           email: user.email,
//           profilePhoto: user.photoURL,
//           plan: 'free',
//           createdAt: new Date(),
//           updatedAt: new Date()
//         };
        
//         await setDoc(doc(db, 'users', user.uid), userData);
//         setUser(userData);
//       }

//       return user;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Logout
//   const logout = async () => {
//     setLoading(true);
//     try {
//       await signOut(auth);
//       setUser(null);
//     } catch (error) {
//       console.error('Logout error:', error);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update user profile
//   const updateUserProfile = async (updates) => {
//     try {
//       let processedUpdates = { ...updates };
      
//       // Process photo if included in updates
//       if (updates.photoURL && typeof updates.photoURL !== 'string') {
//         validateImage(updates.photoURL);
//         const base64String = await fileToBase64(updates.photoURL);
//         processedUpdates.profilePhoto = await compressImage(base64String);
//         // Remove photoURL from updates to Firebase Auth
//         delete processedUpdates.photoURL;
//       }
      
//       processedUpdates.updatedAt = new Date();

//       // Update Firebase Auth profile (without photo)
//       await updateProfile(auth.currentUser, {
//         displayName: processedUpdates.name || user?.name
//       });
      
//       // Update Firestore with profile photo
//       if (user) {
//         await setDoc(doc(db, 'users', user.uid), processedUpdates, { merge: true });
//         setUser(prev => ({ ...prev, ...processedUpdates }));
//       }
//     } catch (error) {
//       console.error('Update profile error:', error);
//       throw error;
//     }
//   };

//   // Reset password
//   const resetPassword = async (email) => {
//     // You can implement this later with Firebase Auth sendPasswordResetEmail
//     console.log('Reset password for:', email);
//   };

//   // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           // Get user data from Firestore (which has the profile photo)
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
          
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setUser({
//               uid: user.uid,
//               email: user.email,
//               name: userData.name || user.displayName,
//               profilePhoto: userData.profilePhoto, // Get from Firestore
//               plan: userData.plan || 'free'
//             });
//           } else {
//             // Create user document if it doesn't exist
//             const userData = {
//               uid: user.uid,
//               name: user.displayName,
//               email: user.email,
//               profilePhoto: null, // No photo initially
//               plan: 'free',
//               createdAt: new Date(),
//               updatedAt: new Date()
//             };
            
//             await setDoc(doc(db, 'users', user.uid), userData);
//             setUser(userData);
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//           setUser({
//             uid: user.uid,
//             email: user.email,
//             name: user.displayName,
//             profilePhoto: null, // Fallback to no photo
//             plan: 'free'
//           });
//         }
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const value = {
//     user,
//     signup,
//     login,
//     logout,
//     updateUserProfile,
//     resetPassword,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;


import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { faceService } from '../services/faceService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Better image compression - don't compress too much for face recognition
  const compressImage = (base64String, maxWidth = 400, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64String;
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        
        // Don't compress too much - faces need detail
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Ensure minimum size for face detection
        if (width < 200) {
          width = 200;
          height = (img.height * 200) / img.width;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        console.log('Image compressed:', {
          original: { width: img.width, height: img.height },
          compressed: { width, height }
        });
        resolve(compressedBase64);
      };
      
      img.onerror = (error) => {
        reject(error);
      };
    });
  };

  // Validate image size and type
  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG, GIF)');
    }
    
    if (file.size > maxSize) {
      throw new Error('Image size should be less than 5MB');
    }
    
    return true;
  };

  // Convert file to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Sign up with email and password - UPDATED WITH BETTER ERROR HANDLING
  const signup = async (name, email, password, profileFile = null) => {
    setLoading(true);
    try {
      console.log('🔄 Starting signup process...');
      
      let profilePhotoUrl = null;
      
      // Process profile photo if provided
      if (profileFile) {
        console.log('📸 Processing profile photo...');
        validateImage(profileFile);
        const base64String = await fileToBase64(profileFile);
        const compressedPhoto = await compressImage(base64String);
        
        // Store in Firestore instead of using as photoURL
        profilePhotoUrl = compressedPhoto;
        console.log('✅ Profile photo processed');
      }

      // Create user in Firebase Auth WITHOUT photoURL
      console.log('🔥 Creating Firebase user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Firebase user created:', user.uid);

      // Update profile with display name only (no photoURL)
      await updateProfile(user, {
        displayName: name,
      });
      console.log('✅ User profile updated');

      // Create user document in Firestore WITH profile photo
      const userData = {
        uid: user.uid,
        name: name,
        email: email,
        profilePhoto: profilePhotoUrl, // Store Base64 here
        plan: 'free',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('💾 Saving user data to Firestore...');
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('✅ User data saved to Firestore');

      // Register face if profile photo provided - NON-BLOCKING
      if (profilePhotoUrl) {
        try {
          console.log('🤖 Starting face registration...');
          await faceService.registerUserFace(user.uid, profilePhotoUrl);
          console.log('✅ Face registration completed successfully');
        } catch (faceError) {
          console.warn('⚠️ Face registration failed, but user account created:', faceError.message);
          // Don't throw error - user account should still be created
          // The user can register their face later in the dashboard
        }
      } else {
        console.log('ℹ️ No profile photo provided for face registration');
      }

      // Update local state
      setUser(userData);
      console.log('✅ Local user state updated');

      console.log('🎉 Signup completed successfully!');
      return user;
      
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          uid: user.uid,
          email: user.email,
          name: userData.name || user.displayName,
          profilePhoto: userData.profilePhoto || user.photoURL,
          plan: userData.plan || 'free'
        });
      } else {
        // Create user document if it doesn't exist (for legacy users)
        const userData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          profilePhoto: user.photoURL,
          plan: 'free',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await setDoc(doc(db, 'users', user.uid), userData);
        setUser(userData);
      }

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      let processedUpdates = { ...updates };
      
      // Process photo if included in updates
      if (updates.photoURL && typeof updates.photoURL !== 'string') {
        validateImage(updates.photoURL);
        const base64String = await fileToBase64(updates.photoURL);
        processedUpdates.profilePhoto = await compressImage(base64String);
        // Remove photoURL from updates to Firebase Auth
        delete processedUpdates.photoURL;
      }
      
      processedUpdates.updatedAt = new Date();

      // Update Firebase Auth profile (without photo)
      await updateProfile(auth.currentUser, {
        displayName: processedUpdates.name || user?.name
      });
      
      // Update Firestore with profile photo
      if (user) {
        await setDoc(doc(db, 'users', user.uid), processedUpdates, { merge: true });
        setUser(prev => ({ ...prev, ...processedUpdates }));
      }
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    // You can implement this later with Firebase Auth sendPasswordResetEmail
    console.log('Reset password for:', email);
  };

  // Listen for auth state changes
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           // Get user data from Firestore (which has the profile photo)
//           const userDoc = await getDoc(doc(db, 'users', user.uid));
          
//           if (userDoc.exists()) {
//             const userData = userDoc.data();
//             setUser({
//               uid: user.uid,
//               email: user.email,
//               name: userData.name || user.displayName,
//               profilePhoto: userData.profilePhoto, // Get from Firestore
//               plan: userData.plan || 'free'
//             });
//           } else {
//             // Create user document if it doesn't exist
//             const userData = {
//               uid: user.uid,
//               name: user.displayName,
//               email: user.email,
//               profilePhoto: null, // No photo initially
//               plan: 'free',
//               createdAt: new Date(),
//               updatedAt: new Date()
//             };
            
//             await setDoc(doc(db, 'users', user.uid), userData);
//             setUser(userData);
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//           setUser({
//             uid: user.uid,
//             email: user.email,
//             name: user.displayName,
//             profilePhoto: null, // Fallback to no photo
//             plan: 'free'
//           });
//         }
//       } else {
//         setUser(null);
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

// In your AuthContext.jsx, update the useEffect:

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: user.uid,
            email: user.email,
            name: userData.name || user.displayName,
            profilePhoto: userData.profilePhoto,
            plan: userData.plan || 'free'
          });
        } else {
          // Create user document if it doesn't exist
          const userData = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            profilePhoto: null,
            plan: 'free',
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await setDoc(doc(db, 'users', user.uid), userData);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          profilePhoto: null,
          plan: 'free'
        });
      }
    } else {
      setUser(null);
    }
    setLoading(false); // MAKE SURE THIS IS CALLED
  });

  return unsubscribe;
}, []);

  const value = {
    user,
    signup,
    login,
    logout,
    updateUserProfile,
    resetPassword,
    loading
  };

  return (
  <AuthContext.Provider value={value}>
    {!loading ? children : (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )}
  </AuthContext.Provider>
);
};

export default AuthProvider;