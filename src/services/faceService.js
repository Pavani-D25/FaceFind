// // import { faceRecognitionService } from './faceRecognition';
// // import { db } from '../firebase/config';
// // import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// // class FaceService {
// //   constructor() {
// //     this.initialized = false;
// //   }

// //   async initialize() {
// //     if (this.initialized) return;
    
// //     try {
// //       await faceRecognitionService.loadModels();
// //       this.initialized = true;
// //       console.log('Face service initialized successfully');
// //     } catch (error) {
// //       console.error('Failed to initialize face service:', error);
// //       throw error;
// //     }
// //   }

// //   // Convert image URL/File to HTMLImageElement
// //   async loadImage(imageSrc) {
// //     return new Promise((resolve, reject) => {
// //       const img = new Image();
// //       img.crossOrigin = 'anonymous';
// //       img.onload = () => resolve(img);
// //       img.onerror = reject;
// //       img.src = imageSrc;
// //     });
// //   }

// //   // Extract and store user's face descriptor
// //   async registerUserFace(userId, profileImage) {
// //     try {
// //       await this.initialize();
      
// //       const img = await this.loadImage(profileImage);
// //       const descriptor = await faceRecognitionService.extractFaceDescriptor(img);
      
// //       if (!descriptor) {
// //         throw new Error('No face detected in profile image');
// //       }

// //       // Convert Float32Array to regular array for Firestore storage
// //       const descriptorArray = Array.from(descriptor);
      
// //       // Store in Firestore
// //       await setDoc(doc(db, 'faceDescriptors', userId), {
// //         userId,
// //         descriptor: descriptorArray,
// //         createdAt: new Date(),
// //         updatedAt: new Date()
// //       });

// //       return descriptorArray;
// //     } catch (error) {
// //       console.error('Error registering user face:', error);
// //       throw error;
// //     }
// //   }

// //   // Get user's face descriptor
// //   async getUserDescriptor(userId) {
// //     try {
// //       const docRef = doc(db, 'faceDescriptors', userId);
// //       const docSnap = await getDoc(docRef);
      
// //       if (docSnap.exists()) {
// //         const data = docSnap.data();
// //         return new Float32Array(data.descriptor);
// //       }
// //       return null;
// //     } catch (error) {
// //       console.error('Error getting user descriptor:', error);
// //       return null;
// //     }
// //   }

// //   // Process group photo and find matches
// //   async processGroupPhoto(groupImage, currentUserId) {
// //     try {
// //       await this.initialize();

// //       const img = await this.loadImage(groupImage);
// //       const groupFaces = await faceRecognitionService.detectFaces(img);
      
// //       if (groupFaces.length === 0) {
// //         return { matches: [], totalFaces: 0 };
// //       }

// //       // Get current user's descriptor
// //       const currentUserDescriptor = await this.getUserDescriptor(currentUserId);
      
// //       // In a real app, you'd get descriptors for all users in the event/group
// //       // For now, we'll simulate multiple users
// //       const simulatedDescriptors = await this.getSimulatedDescriptors();
      
// //       const matches = [];
// //       const matchedFaces = new Set();

// //       for (const groupFace of groupFaces) {
// //         let bestMatch = null;
// //         let bestConfidence = 0;

// //         // Check against current user first
// //         if (currentUserDescriptor) {
// //           const userComparison = faceRecognitionService.isMatch(
// //             groupFace.descriptor, 
// //             currentUserDescriptor
// //           );
          
// //           if (userComparison.isMatch && userComparison.confidence > bestConfidence) {
// //             bestConfidence = userComparison.confidence;
// //             bestMatch = {
// //               userId: currentUserId,
// //               userName: 'You',
// //               confidence: userComparison.confidence,
// //               faceLocation: groupFace.detection.box,
// //               isCurrentUser: true
// //             };
// //           }
// //         }

// //         // Check against simulated users
// //         for (const simulatedUser of simulatedDescriptors) {
// //           const comparison = faceRecognitionService.isMatch(
// //             groupFace.descriptor, 
// //             simulatedUser.descriptor
// //           );
          
// //           if (comparison.isMatch && comparison.confidence > bestConfidence) {
// //             bestConfidence = comparison.confidence;
// //             bestMatch = {
// //               userId: simulatedUser.userId,
// //               userName: simulatedUser.userName,
// //               confidence: comparison.confidence,
// //               faceLocation: groupFace.detection.box,
// //               isCurrentUser: false
// //             };
// //           }
// //         }

// //         if (bestMatch && bestConfidence > 0.7) { // 70% confidence threshold
// //           matches.push(bestMatch);
// //           matchedFaces.add(bestMatch.userId);
// //         }
// //       }

// //       return {
// //         matches,
// //         totalFaces: groupFaces.length,
// //         matchedFaces: matchedFaces.size
// //       };
// //     } catch (error) {
// //       console.error('Error processing group photo:', error);
// //       throw error;
// //     }
// //   }

// //   // Simulate other users for demo purposes
// //   async getSimulatedDescriptors() {
// //     // In a real app, you'd fetch these from your database
// //     // For demo, we'll create some simulated data
// //     const simulatedUsers = [
// //       {
// //         userId: 'user2',
// //         userName: 'Sarah Johnson',
// //         descriptor: this.generateRandomDescriptor()
// //       },
// //       {
// //         userId: 'user3', 
// //         userName: 'Mike Chen',
// //         descriptor: this.generateRandomDescriptor()
// //       },
// //       {
// //         userId: 'user4',
// //         userName: 'Emma Davis',
// //         descriptor: this.generateRandomDescriptor()
// //       }
// //     ];

// //     return simulatedUsers;
// //   }

// //   generateRandomDescriptor() {
// //     // Generate a random descriptor for demo purposes
// //     // In real app, these would be actual face descriptors
// //     return new Float32Array(128).map(() => Math.random() * 2 - 1);
// //   }

// //   // Draw face detection boxes on image (for visualization)
// //   drawFaceBoxes(canvas, detections) {
// //     const ctx = canvas.getContext('2d');
// //     ctx.strokeStyle = '#00ff00';
// //     ctx.lineWidth = 2;
// //     ctx.font = '16px Arial';
// //     ctx.fillStyle = '#00ff00';

// //     detections.forEach(detection => {
// //       const box = detection.detection.box;
// //       ctx.strokeRect(box.x, box.y, box.width, box.height);
// //       ctx.fillText(
// //         `Confidence: ${(detection.detection.score * 100).toFixed(1)}%`,
// //         box.x,
// //         box.y > 20 ? box.y - 5 : box.y + box.height + 15
// //       );
// //     });
// //   }
// // }

// // export const faceService = new FaceService();



// import { faceRecognitionService } from './faceRecognition';
// import { db } from '../firebase/config';
// import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

// class FaceService {
//   constructor() {
//     this.initialized = false;
//   }

//   async initialize() {
//     if (this.initialized) return;
    
//     try {
//       await faceRecognitionService.loadModels();
//       this.initialized = true;
//       console.log('Face service initialized successfully');
//     } catch (error) {
//       console.error('Failed to initialize face service:', error);
//       throw error;
//     }
//   }

//   // Convert image URL/File to HTMLImageElement
//   async loadImage(imageSrc) {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.crossOrigin = 'anonymous';
//       img.onload = () => {
//         console.log('Image loaded successfully:', {
//           width: img.width,
//           height: img.height,
//           src: imageSrc.substring(0, 100) // Log first 100 chars of base64
//         });
//         resolve(img);
//       };
//       img.onerror = (error) => {
//         console.error('Error loading image:', error);
//         reject(error);
//       };
//       img.src = imageSrc;
//     });
//   }

//   // Extract and store user's face descriptor
//   async registerUserFace(userId, profileImage) {
//     try {
//       await this.initialize();
      
//       console.log('Starting face registration for user:', userId);
//       const img = await this.loadImage(profileImage);
//       const detection = await faceRecognitionService.extractFaceDescriptor(img);
      
//       if (!detection) {
//         throw new Error('No face detected in profile image');
//       }

//       // Convert Float32Array to regular array for Firestore storage
//       const descriptorArray = Array.from(detection);
      
//       console.log('Face descriptor extracted:', descriptorArray.length, 'dimensions');
      
//       // Store in Firestore
//       await setDoc(doc(db, 'faceDescriptors', userId), {
//         userId,
//         descriptor: descriptorArray,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         imageDimensions: { width: img.width, height: img.height }
//       });

//       console.log('User face registered successfully in Firestore');
//       return descriptorArray;
//     } catch (error) {
//       console.error('Error registering user face:', error);
//       throw error;
//     }
//   }

//   // Get user's face descriptor
//   async getUserDescriptor(userId) {
//     try {
//       const docRef = doc(db, 'faceDescriptors', userId);
//       const docSnap = await getDoc(docRef);
      
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         console.log('Retrieved descriptor from Firestore:', data.descriptor.length, 'dimensions');
//         return new Float32Array(data.descriptor);
//       }
//       console.log('No descriptor found in Firestore for user:', userId);
//       return null;
//     } catch (error) {
//       console.error('Error getting user descriptor:', error);
//       return null;
//     }
//   }

//   // Process group photo and find matches
//   async processGroupPhoto(groupImage, currentUserId) {
//     try {
//       await this.initialize();

//       console.log('Starting group photo processing for user:', currentUserId);
//       const img = await this.loadImage(groupImage);
      
//       const groupFaces = await faceRecognitionService.detectFaces(img);
//       console.log('Faces detected in group photo:', groupFaces.length);
      
//       if (groupFaces.length === 0) {
//         console.log('NO FACES DETECTED in group photo');
//         return { matches: [], totalFaces: 0 };
//       }

//       // Get current user's descriptor
//       const currentUserDescriptor = await this.getUserDescriptor(currentUserId);
//       console.log('Current user descriptor found:', !!currentUserDescriptor);
      
//       if (!currentUserDescriptor) {
//         console.log('No user descriptor found for current user');
//         return { matches: [], totalFaces: groupFaces.length };
//       }

//       // In a real app, you'd get descriptors for all users in the event/group
//       // For now, we'll simulate multiple users
//       const simulatedDescriptors = await this.getSimulatedDescriptors();
      
//       const matches = [];
//       const matchedFaces = new Set();

//       console.log('Starting face matching process...');
      
//       for (const groupFace of groupFaces) {
//         let bestMatch = null;
//         let bestConfidence = 0;

//         // Check against current user first
//         if (currentUserDescriptor) {
//           const userComparison = faceRecognitionService.isMatch(
//             groupFace.descriptor, 
//             currentUserDescriptor
//           );
          
//           console.log('Comparison with current user:', userComparison);
          
//           if (userComparison.isMatch && userComparison.confidence > bestConfidence) {
//             bestConfidence = userComparison.confidence;
//             bestMatch = {
//               userId: currentUserId,
//               userName: 'You',
//               confidence: userComparison.confidence,
//               faceLocation: groupFace.detection.box,
//               isCurrentUser: true
//             };
//           }
//         }

//         // Check against simulated users
//         for (const simulatedUser of simulatedDescriptors) {
//           const comparison = faceRecognitionService.isMatch(
//             groupFace.descriptor, 
//             simulatedUser.descriptor
//           );
          
//           if (comparison.isMatch && comparison.confidence > bestConfidence) {
//             bestConfidence = comparison.confidence;
//             bestMatch = {
//               userId: simulatedUser.userId,
//               userName: simulatedUser.userName,
//               confidence: comparison.confidence,
//               faceLocation: groupFace.detection.box,
//               isCurrentUser: false
//             };
//           }
//         }

//         // Lower threshold for testing - you can adjust this later
//         if (bestMatch && bestConfidence > 0.5) { // 50% confidence threshold for testing
//           matches.push(bestMatch);
//           matchedFaces.add(bestMatch.userId);
//           console.log('Match found:', bestMatch);
//         }
//       }

//       console.log('Matching completed. Total matches:', matches.length);
      
//       return {
//         matches,
//         totalFaces: groupFaces.length,
//         matchedFaces: matchedFaces.size
//       };
//     } catch (error) {
//       console.error('Error processing group photo:', error);
//       throw error;
//     }
//   }

//   // Test function to verify face recognition
//   async testFaceRecognition(userId, testImage) {
//     try {
//       console.log('=== FACE RECOGNITION TEST ===');
      
//       // Load test image
//       const testImg = await this.loadImage(testImage);
      
//       // Detect faces in test image
//       const testFaces = await faceRecognitionService.detectFaces(testImg);
//       console.log('Test image - faces detected:', testFaces.length);
      
//       // Get user descriptor
//       const userDescriptor = await this.getUserDescriptor(userId);
//       console.log('User descriptor available:', !!userDescriptor);
      
//       if (testFaces.length > 0 && userDescriptor) {
//         // Test matching
//         const testResult = faceRecognitionService.isMatch(testFaces[0].descriptor, userDescriptor);
//         console.log('Direct match test:', testResult);
        
//         return testResult;
//       }
      
//       return null;
//     } catch (error) {
//       console.error('Test failed:', error);
//       return null;
//     }
//   }

//   // Simulate other users for demo purposes
//   async getSimulatedDescriptors() {
//     // In a real app, you'd fetch these from your database
//     // For demo, we'll create some simulated data
//     const simulatedUsers = [
//       {
//         userId: 'user2',
//         userName: 'Sarah Johnson',
//         descriptor: this.generateRandomDescriptor()
//       },
//       {
//         userId: 'user3', 
//         userName: 'Mike Chen',
//         descriptor: this.generateRandomDescriptor()
//       },
//       {
//         userId: 'user4',
//         userName: 'Emma Davis',
//         descriptor: this.generateRandomDescriptor()
//       }
//     ];

//     return simulatedUsers;
//   }

//   generateRandomDescriptor() {
//     // Generate a random descriptor for demo purposes
//     // In real app, these would be actual face descriptors
//     return new Float32Array(128).map(() => Math.random() * 2 - 1);
//   }
// }

// export const faceService = new FaceService();


import { faceRecognitionService } from './faceRecognition';
import { db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

class FaceService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    try {
      await faceRecognitionService.loadModels();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize face service:', error);
    }
  }

  async loadImage(imageSrc) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageSrc;
    });
  }

 async registerUserFace(userId, profileImage) {
  try {
    await this.initialize();
    
    console.log('📸 Starting face registration for user:', userId);
    const img = await this.loadImage(profileImage);
    
    console.log('🔍 Extracting face descriptor...');
    const detection = await faceRecognitionService.extractFaceDescriptor(img);
    
    if (!detection) {
      console.error('❌ No face detected in profile image');
      throw new Error('No face detected in your profile photo. Please use a clear face photo.');
    }

    // Convert Float32Array to regular array for Firestore storage
    const descriptorArray = Array.from(detection);
    
    console.log('✅ Face descriptor extracted:', descriptorArray.length, 'dimensions');
    
    // Store in Firestore
    await setDoc(doc(db, 'faceDescriptors', userId), {
      userId,
      descriptor: descriptorArray,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('💾 Face descriptor saved to Firestore for user:', userId);
    return true;
    
  } catch (error) {
    console.error('❌ Face registration failed:', error);
    
    if (error.message.includes('No face detected')) {
      throw new Error('No face detected in your profile photo. Please use a clear face photo.');
    }
    
    throw new Error('Failed to register face: ' + error.message);
  }
}


  async getUserDescriptor(userId) {
    try {
      const docRef = doc(db, 'faceDescriptors', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return new Float32Array(data.descriptor);
      }
      return null;
    } catch (error) {
      console.error('Error getting descriptor:', error);
      return null;
    }
  }


// async processGroupPhoto(groupImage, currentUserId) {
//   try {
//     console.log('🚀 STARTING FACE RECOGNITION PIPELINE');
    
//     await this.initialize();
//     const img = await this.loadImage(groupImage);
    
//     console.log('📸 Image loaded, starting face detection...');
//     const groupFaces = await faceRecognitionService.detectFaces(img);
    
//     console.log('🔍 Face detection completed. Found:', groupFaces.length, 'faces');
    
//     if (groupFaces.length === 0) {
//       return { 
//         matches: [], 
//         totalFaces: 0, 
//         message: 'No faces detected in the image',
//         debug: {
//           imageWidth: img.width,
//           imageHeight: img.height
//         }
//       };
//     }

//     console.log('👤 Getting user descriptor for:', currentUserId);
//     const currentUserDescriptor = await this.getUserDescriptor(currentUserId);
    
//     if (!currentUserDescriptor) {
//       return { 
//         matches: [], 
//         totalFaces: groupFaces.length, 
//         message: 'User face not registered. Please add a profile photo first.' 
//       };
//     }

//     console.log('🔄 Starting face matching...');
//     const matches = [];

//     for (let i = 0; i < groupFaces.length; i++) {
//       const groupFace = groupFaces[i];
//       console.log(`Matching face ${i + 1}/${groupFaces.length}`);
      
//       const comparison = faceRecognitionService.isMatch(
//         groupFace.descriptor, 
//         currentUserDescriptor
//       );
      
//       console.log(`Face ${i + 1} match result:`, {
//         distance: comparison.distance,
//         confidence: comparison.confidence,
//         isMatch: comparison.isMatch
//       });

//       // Use lower threshold for testing
//       if (comparison.isMatch && comparison.confidence > 0.4) {
//         matches.push({
//           userId: currentUserId,
//           userName: 'You',
//           confidence: comparison.confidence,
//           isCurrentUser: true,
//           faceIndex: i
//         });
//         console.log(`✅ MATCH FOUND for face ${i + 1}`);
//       }
//     }

//     console.log('🎉 Matching completed. Total matches:', matches.length);
    
//     return {
//       matches,
//       totalFaces: groupFaces.length,
//       matchedFaces: matches.length,
//       debug: {
//         faceDetectionCount: groupFaces.length,
//         matchCount: matches.length,
//         confidenceScores: matches.map(m => m.confidence)
//       }
//     };
//   } catch (error) {
//     console.error('💥 FACE RECOGNITION PIPELINE FAILED:', error);
//     return { 
//       matches: [], 
//       totalFaces: 0, 
//       error: error.message,
//       stack: error.stack 
//     };
//   }
// }

// In your FaceService.js, update the matching logic:
async processGroupPhoto(groupImage, currentUserId) {
  try {
    await this.initialize();
    const img = await this.loadImage(groupImage);
    const groupFaces = await faceRecognitionService.detectFaces(img);
    
    if (groupFaces.length === 0) {
      return { matches: [], totalFaces: 0, message: 'No faces detected' };
    }

    const currentUserDescriptor = await this.getUserDescriptor(currentUserId);
    
    if (!currentUserDescriptor) {
      return { matches: [], totalFaces: groupFaces.length, message: 'User face not registered' };
    }

    const matches = [];

    for (const groupFace of groupFaces) {
      const comparison = faceRecognitionService.isMatch(
        groupFace.descriptor, 
        currentUserDescriptor
      );
      
      // Only include matches with confidence >= 30%
      if (comparison.isMatch && comparison.confidence >= 0.2) {
        matches.push({
          userId: currentUserId,
          userName: 'You',
          confidence: comparison.confidence,
          isCurrentUser: true
        });
      }
    }

    return {
      matches,
      totalFaces: groupFaces.length,
      matchedFaces: matches.length
    };
  } catch (error) {
    console.error('Error processing group photo:', error);
    return { matches: [], totalFaces: 0, error: error.message };
  }
}
}

export const faceService = new FaceService();