// // import React, { useState } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { Camera, Mail, Lock, User, Eye, EyeOff, Check, AlertCircle, ArrowRight, Upload, X } from 'lucide-react';
// // import { useAuth } from '../../context/AuthContext';

// // const Signup = () => {
// //   const navigate = useNavigate();
// //   const { signup, loading } = useAuth();
// //   const [step, setStep] = useState(1);
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     email: '',
// //     password: '',
// //     confirmPassword: ''
// //   });
// //   const [profileFile, setProfileFile] = useState(null);
// //   const [photoPreview, setPhotoPreview] = useState(null);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [fieldErrors, setFieldErrors] = useState({});
// //   const [error, setError] = useState('');

// //   const validateStep1 = () => {
// //     const errors = {};
    
// //     if (!formData.name.trim()) {
// //       errors.name = 'Name is required';
// //     } else if (formData.name.length < 2) {
// //       errors.name = 'Name must be at least 2 characters';
// //     }
    
// //     if (!formData.email) {
// //       errors.email = 'Email is required';
// //     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
// //       errors.email = 'Email is invalid';
// //     }
    
// //     if (!formData.password) {
// //       errors.password = 'Password is required';
// //     } else if (formData.password.length < 6) {
// //       errors.password = 'Password must be at least 6 characters';
// //     }
    
// //     if (formData.password !== formData.confirmPassword) {
// //       errors.confirmPassword = 'Passwords do not match';
// //     }
    
// //     setFieldErrors(errors);
// //     return Object.keys(errors).length === 0;
// //   };

// //   const handleNext = () => {
// //     if (validateStep1()) {
// //       setStep(2);
// //     }
// //   };

// //   const handlePhotoUpload = (e) => {
// //     const file = e.target.files[0];
// //     if (file) {
// //       try {
// //         // Validate file type and size
// //         const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
// //         const maxSize = 5 * 1024 * 1024; // 5MB
        
// //         if (!allowedTypes.includes(file.type)) {
// //           setError('Please select a valid image file (JPEG, PNG, GIF)');
// //           return;
// //         }
        
// //         if (file.size > maxSize) {
// //           setError('Image size should be less than 5MB');
// //           return;
// //         }
        
// //         setProfileFile(file);
// //         setError('');
        
// //         // Create preview
// //         const reader = new FileReader();
// //         reader.onloadend = () => {
// //           setPhotoPreview(reader.result);
// //         };
// //         reader.readAsDataURL(file);
// //       } catch (err) {
// //         setError('Error processing image. Please try another file.');
// //       }
// //     }
// //   };

// //   const removePhoto = () => {
// //     setProfileFile(null);
// //     setPhotoPreview(null);
// //     setError('');
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError('');
    
// //     try {
// //       await signup(formData.name, formData.email, formData.password, profileFile);
// //       navigate('/dashboard');
// //     } catch (err) {
// //       switch (err.code) {
// //         case 'auth/email-already-in-use':
// //           setError('An account with this email already exists.');
// //           break;
// //         case 'auth/invalid-email':
// //           setError('Invalid email address.');
// //           break;
// //         case 'auth/weak-password':
// //           setError('Password should be at least 6 characters.');
// //           break;
// //         default:
// //           setError(err.message || 'Failed to create account. Please try again.');
// //       }
// //     }
// //   };

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //     if (fieldErrors[e.target.name]) {
// //       setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
// //     }
// //     if (error) setError('');
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
// //       {/* Background Animation */}
// //       <div className="absolute inset-0 overflow-hidden pointer-events-none">
// //         <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-20 right-20 animate-pulse"></div>
// //         <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl bottom-20 left-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
// //       </div>

// //       <div className="w-full max-w-md relative z-10">
// //         {/* Logo */}
// //         <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
// //           <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
// //             <Camera className="w-7 h-7 text-white" />
// //           </div>
// //           <span className="text-2xl font-bold text-white">FaceFind</span>
// //         </Link>

// //         {/* Signup Card */}
// //         <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
// //           {/* Progress Steps */}
// //           <div className="flex items-center justify-center mb-8">
// //             <div className="flex items-center">
// //               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
// //                 step >= 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'
// //               } transition`}>
// //                 {step > 1 ? <Check className="w-5 h-5 text-white" /> : <span className="text-white font-semibold">1</span>}
// //               </div>
// //               <div className={`w-16 h-1 ${step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'} transition`}></div>
// //               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
// //                 step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'
// //               } transition`}>
// //                 <span className="text-white font-semibold">2</span>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="text-center mb-8">
// //             <h2 className="text-3xl font-bold text-white mb-2">
// //               {step === 1 ? 'Create Account' : 'Profile Photo'}
// //             </h2>
// //             <p className="text-gray-400">
// //               {step === 1 ? 'Sign up to get started with FaceFind' : 'Add your photo for face recognition (optional)'}
// //             </p>
// //           </div>

// //           {error && (
// //             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
// //               <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
// //               <p className="text-red-400 text-sm">{error}</p>
// //             </div>
// //           )}

// //           {step === 1 ? (
// //             <form className="space-y-5">
// //               {/* Name Field */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
// //                 <div className="relative">
// //                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     type="text"
// //                     name="name"
// //                     value={formData.name}
// //                     onChange={handleChange}
// //                     className={`w-full pl-11 pr-4 py-3 bg-slate-700/50 border ${
// //                       fieldErrors.name ? 'border-red-500' : 'border-slate-600'
// //                     } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
// //                     placeholder="John Doe"
// //                   />
// //                 </div>
// //                 {fieldErrors.name && (
// //                   <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>
// //                 )}
// //               </div>

// //               {/* Email Field */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     type="email"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleChange}
// //                     className={`w-full pl-11 pr-4 py-3 bg-slate-700/50 border ${
// //                       fieldErrors.email ? 'border-red-500' : 'border-slate-600'
// //                     } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
// //                     placeholder="you@example.com"
// //                   />
// //                 </div>
// //                 {fieldErrors.email && (
// //                   <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
// //                 )}
// //               </div>

// //               {/* Password Field */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     type={showPassword ? 'text' : 'password'}
// //                     name="password"
// //                     value={formData.password}
// //                     onChange={handleChange}
// //                     className={`w-full pl-11 pr-12 py-3 bg-slate-700/50 border ${
// //                       fieldErrors.password ? 'border-red-500' : 'border-slate-600'
// //                     } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
// //                     placeholder="At least 6 characters"
// //                   />
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
// //                   >
// //                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
// //                   </button>
// //                 </div>
// //                 {fieldErrors.password && (
// //                   <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
// //                 )}
// //               </div>

// //               {/* Confirm Password Field */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
// //                   <input
// //                     type="password"
// //                     name="confirmPassword"
// //                     value={formData.confirmPassword}
// //                     onChange={handleChange}
// //                     className={`w-full pl-11 pr-4 py-3 bg-slate-700/50 border ${
// //                       fieldErrors.confirmPassword ? 'border-red-500' : 'border-slate-600'
// //                     } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
// //                     placeholder="Confirm your password"
// //                   />
// //                 </div>
// //                 {fieldErrors.confirmPassword && (
// //                   <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
// //                 )}
// //               </div>

// //               {/* Terms */}
// //               <label className="flex items-start">
// //                 <input 
// //                   type="checkbox" 
// //                   className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-0 mt-1" 
// //                   required 
// //                 />
// //                 <span className="ml-2 text-sm text-gray-300">
// //                   I agree to the{' '}
// //                   <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
// //                   {' '}and{' '}
// //                   <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
// //                 </span>
// //               </label>

// //               {/* Next Button */}
// //               <button
// //                 type="button"
// //                 onClick={handleNext}
// //                 className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
// //               >
// //                 Continue
// //                 <ArrowRight className="w-5 h-5" />
// //               </button>
// //             </form>
// //           ) : (
// //             <form onSubmit={handleSubmit} className="space-y-6">
// //               {/* Photo Upload */}
// //               <div>
// //                 {!photoPreview ? (
// //                   <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer">
// //                     <input
// //                       type="file"
// //                       accept="image/jpeg,image/jpg,image/png,image/gif"
// //                       onChange={handlePhotoUpload}
// //                       className="hidden"
// //                       id="photo-upload"
// //                     />
// //                     <label htmlFor="photo-upload" className="cursor-pointer">
// //                       <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
// //                       <p className="text-white font-semibold mb-2">Upload Your Photo</p>
// //                       <p className="text-sm text-gray-400">Click to browse or drag and drop</p>
// //                       <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
// //                     </label>
// //                   </div>
// //                 ) : (
// //                   <div className="relative">
// //                     <img
// //                       src={photoPreview}
// //                       alt="Preview"
// //                       className="w-full h-64 object-cover rounded-xl"
// //                     />
// //                     <button
// //                       type="button"
// //                       onClick={removePhoto}
// //                       className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
// //                     >
// //                       <X className="w-5 h-5 text-white" />
// //                     </button>
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
// //                 <p className="text-sm text-purple-300">
// //                   <strong>Tip:</strong> Adding a clear profile photo helps our AI recognize you better in group photos.
// //                 </p>
// //               </div>

// //               <div className="flex gap-3">
// //                 <button
// //                   type="button"
// //                   onClick={() => setStep(1)}
// //                   className="flex-1 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
// //                 >
// //                   Back
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={loading}
// //                   className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
// //                 >
// //                   {loading ? (
// //                     <>
// //                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
// //                       Creating Account...
// //                     </>
// //                   ) : (
// //                     'Complete Sign Up'
// //                   )}
// //                 </button>
// //               </div>
// //             </form>
// //           )}
// //         </div>

// //         {/* Back to Home */}
// //         <Link to="/" className="block text-center mt-6 text-gray-400 hover:text-gray-300 transition">
// //           ← Back to home
// //         </Link>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Signup;



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Camera, Mail, Lock, User, Eye, EyeOff, Check, AlertCircle, ArrowRight, Upload, X } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// const Signup = () => {
//   const navigate = useNavigate();
//   const { signup, loading } = useAuth();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [profileFile, setProfileFile] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({});
//   const [error, setError] = useState('');

//   const validateStep1 = () => {
//     const errors = {};
    
//     if (!formData.name.trim()) {
//       errors.name = 'Name is required';
//     } else if (formData.name.length < 2) {
//       errors.name = 'Name must be at least 2 characters';
//     }
    
//     if (!formData.email) {
//       errors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       errors.email = 'Email is invalid';
//     }
    
//     if (!formData.password) {
//       errors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       errors.password = 'Password must be at least 6 characters';
//     }
    
//     if (formData.password !== formData.confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match';
//     }
    
//     setFieldErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateStep1()) {
//       setStep(2);
//     }
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       try {
//         // Validate file type and size
//         const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//         const maxSize = 5 * 1024 * 1024; // 5MB
        
//         if (!allowedTypes.includes(file.type)) {
//           setError('Please select a valid image file (JPEG, PNG, GIF)');
//           return;
//         }
        
//         if (file.size > maxSize) {
//           setError('Image size should be less than 5MB');
//           return;
//         }
        
//         setProfileFile(file);
//         setError('');
        
//         // Create preview
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setPhotoPreview(reader.result);
//         };
//         reader.readAsDataURL(file);
//       } catch (err) {
//         setError('Error processing image. Please try another file.');
//       }
//     }
//   };

//   const removePhoto = () => {
//     setProfileFile(null);
//     setPhotoPreview(null);
//     setError('');
//   };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
  
//   // REQUIRE profile photo for face registration
//   if (!profileFile) {
//     setError('Profile photo is required for face recognition. Please upload a clear photo of your face.');
//     return;
//   }
  
//   try {
//     await signup(formData.name, formData.email, formData.password, profileFile);
//     // Navigation should happen automatically after successful signup
//     // The AuthContext should handle the redirect
//     console.log('✅ Signup successful, should navigate to dashboard...');
//   } catch (err) {
//     console.error('❌ Signup failed:', err);
//     switch (err.code) {
//       case 'auth/email-already-in-use':
//         setError('An account with this email already exists.');
//         break;
//       case 'auth/invalid-email':
//         setError('Invalid email address.');
//         break;
//       case 'auth/weak-password':
//         setError('Password should be at least 6 characters.');
//         break;
//       default:
//         setError(err.message || 'Failed to create account. Please try again.');
//     }
//   }
// };
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (fieldErrors[e.target.name]) {
//       setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
//     }
//     if (error) setError('');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       {/* Background Animation */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-20 right-20 animate-pulse"></div>
//         <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl bottom-20 left-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
//       </div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Logo */}
//         <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
//           <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
//             <Camera className="w-7 h-7 text-white" />
//           </div>
//           <span className="text-2xl font-bold text-white">FaceFind</span>
//         </Link>

//         {/* Signup Card */}
//         <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
//           {/* Progress Steps */}
//           <div className="flex items-center justify-center mb-8">
//             <div className="flex items-center">
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                 step >= 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'
//               } transition`}>
//                 {step > 1 ? <Check className="w-5 h-5 text-white" /> : <span className="text-white font-semibold">1</span>}
//               </div>
//               <div className={`w-16 h-1 ${step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'} transition`}></div>
//               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                 step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'
//               } transition`}>
//                 <span className="text-white font-semibold">2</span>
//               </div>
//             </div>
//           </div>

//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-white mb-2">
//               {step === 1 ? 'Create Account' : 'Face Registration'}
//             </h2>
//             <p className="text-gray-400">
//               {step === 1 ? 'Sign up to get started with FaceFind' : 'Upload your photo for AI face recognition'}
//             </p>
//           </div>

//           {error && (
//             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
//               <p className="text-red-400 text-sm">{error}</p>
//             </div>
//           )}

//           {step === 1 ? (
//             <form className="space-y-5">
//               {/* Name Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className={`w-full pl-11 pr-4 py-3 bg-slate-700/50 border ${
//                       fieldErrors.name ? 'border-red-500' : 'border-slate-600'
//                     } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
//                     placeholder="John Doe"
//                   />
//                 </div>
//                 {fieldErrors.name && (
//                   <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>
//                 )}
//               </div>

//               {/* Email Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`w-full pl-11 pr-4 py-3 bg-slate-700/50 border ${
//                       fieldErrors.email ? 'border-red-500' : 'border-slate-600'
//                     } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
//                     placeholder="you@example.com"
//                   />
//                 </div>
//                 {fieldErrors.email && (
//                   <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
//                 )}
//               </div>

//               {/* Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`w-full pl-11 pr-12 py-3 bg-slate-700/50 border ${
//                       fieldErrors.password ? 'border-red-500' : 'border-slate-600'
//                     } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
//                     placeholder="At least 6 characters"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {fieldErrors.password && (
//                   <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
//                 )}
//               </div>

//               {/* Confirm Password Field */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     className={`w-full pl-11 pr-4 py-3 bg-slate-700/50 border ${
//                       fieldErrors.confirmPassword ? 'border-red-500' : 'border-slate-600'
//                     } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
//                     placeholder="Confirm your password"
//                   />
//                 </div>
//                 {fieldErrors.confirmPassword && (
//                   <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
//                 )}
//               </div>

//               {/* Terms */}
//               <label className="flex items-start">
//                 <input 
//                   type="checkbox" 
//                   className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-0 mt-1" 
//                   required 
//                 />
//                 <span className="ml-2 text-sm text-gray-300">
//                   I agree to the{' '}
//                   <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
//                   {' '}and{' '}
//                   <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
//                 </span>
//               </label>

//               {/* Next Button */}
//               <button
//                 type="button"
//                 onClick={handleNext}
//                 className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
//               >
//                 Continue
//                 <ArrowRight className="w-5 h-5" />
//               </button>
//             </form>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Photo Upload - Now Required */}
//               <div>
//                 {!photoPreview ? (
//                   <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer">
//                     <input
//                       type="file"
//                       accept="image/jpeg,image/jpg,image/png,image/gif"
//                       onChange={handlePhotoUpload}
//                       className="hidden"
//                       id="photo-upload"
//                       required
//                     />
//                     <label htmlFor="photo-upload" className="cursor-pointer">
//                       <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                       <p className="text-white font-semibold mb-2">Upload Your Face Photo</p>
//                       <p className="text-sm text-gray-400">Required for face recognition</p>
//                       <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
//                     </label>
//                   </div>
//                 ) : (
//                   <div className="relative">
//                     <img
//                       src={photoPreview}
//                       alt="Preview"
//                       className="w-full h-64 object-cover rounded-xl"
//                     />
//                     <button
//                       type="button"
//                       onClick={removePhoto}
//                       className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
//                     >
//                       <X className="w-5 h-5 text-white" />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
//                 <p className="text-sm text-purple-300">
//                   <strong>Important:</strong> A clear face photo is required for AI face recognition. 
//                   This photo will be used to identify you in group photos.
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => setStep(1)}
//                   className="flex-1 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
//                 >
//                   Back
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading || !profileFile}
//                   className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
//                       Creating Account...
//                     </>
//                   ) : (
//                     'Complete Registration'
//                   )}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>

//         {/* Back to Home */}
//         <Link to="/" className="block text-center mt-6 text-gray-400 hover:text-gray-300 transition">
//           ← Back to home
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Mail, Lock, User, Eye, EyeOff, Check, AlertCircle, ArrowRight, Upload, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileFile, setProfileFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');

  const validateStep1 = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        if (!allowedTypes.includes(file.type)) {
          setError('Please select a valid image file (JPEG, PNG, GIF)');
          return;
        }
        
        if (file.size > maxSize) {
          setError('Image size should be less than 5MB');
          return;
        }
        
        setProfileFile(file);
        setError('');
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Error processing image. Please try another file.');
      }
    }
  };

  const removePhoto = () => {
    setProfileFile(null);
    setPhotoPreview(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // REQUIRE profile photo for face registration
    if (!profileFile) {
      setError('Profile photo is required for face recognition. Please upload a clear photo of your face.');
      return;
    }
    
    try {
      console.log('🚀 Starting registration process...');
      await signup(formData.name, formData.email, formData.password, profileFile);
      
      // SUCCESS - Navigate to dashboard
      console.log('✅ Registration successful, navigating to dashboard...');
      navigate('/dashboard');
      
    } catch (err) {
      console.error('❌ Registration failed:', err);
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        default:
          setError(err.message || 'Failed to create account. Please try again.');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-20 right-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-pink-500/20 rounded-full blur-3xl bottom-20 left-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Camera className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">FaceFind</span>
        </Link>

        {/* Signup Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'
              } transition`}>
                {step > 1 ? <Check className="w-5 h-5 text-white" /> : <span className="text-white font-semibold">1</span>}
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'} transition`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'
              } transition`}>
                <span className="text-white font-semibold">2</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? 'Create Account' : 'Face Registration'}
            </h2>
            <p className="text-gray-400">
              {step === 1 ? 'Sign up to get started with FaceFind' : 'Upload your photo for AI face recognition'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form className="space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-700/50 border ${
                      fieldErrors.name ? 'border-red-500' : 'border-slate-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
                    placeholder="John Doe"
                  />
                </div>
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-700/50 border ${
                      fieldErrors.email ? 'border-red-500' : 'border-slate-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
                    placeholder="you@example.com"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3 bg-slate-700/50 border ${
                      fieldErrors.password ? 'border-red-500' : 'border-slate-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-700/50 border ${
                      fieldErrors.confirmPassword ? 'border-red-500' : 'border-slate-600'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition`}
                    placeholder="Confirm your password"
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-0 mt-1" 
                  required 
                />
                <span className="ml-2 text-sm text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
                </span>
              </label>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload - Now Required */}
              <div>
                {!photoPreview ? (
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                      required
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-white font-semibold mb-2">Upload Your Face Photo</p>
                      <p className="text-sm text-gray-400">Required for face recognition</p>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 5MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="text-sm text-purple-300">
                  <strong>Important:</strong> A clear face photo is required for AI face recognition. 
                  This photo will be used to identify you in group photos.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !profileFile}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back to Home */}
        <Link to="/" className="block text-center mt-6 text-gray-400 hover:text-gray-300 transition">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Signup;