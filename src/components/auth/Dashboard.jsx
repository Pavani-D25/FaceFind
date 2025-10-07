// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Camera, Upload, Search, Bell, User, Image, Download, Share2, 
//   Users, Zap, Settings, History 
// } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import { useDropzone } from 'react-dropzone';
// import { faceService } from '../../services/faceService';
// import toast, { Toaster } from 'react-hot-toast';

// const Dashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState('upload');
//   const [uploadedPhotos, setUploadedPhotos] = useState([]);
//   const [processing, setProcessing] = useState(false);
//   const [matches, setMatches] = useState([]);
//   const [analytics, setAnalytics] = useState({
//     totalPhotos: 0,
//     totalMatches: 0,
//     accuracy: 0
//   });
//   const fileInputRef = useRef();

//   useEffect(() => {
//     // Initialize face service when dashboard loads
//     faceService.initialize().catch(console.error);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   // Add this diagnostic component to your Dashboard
// const FaceRecognitionDiagnostics = () => {
//   const [diagnostics, setDiagnostics] = useState(null);

//   const runDiagnostics = async () => {
//     if (uploadedPhotos.length === 0) {
//       toast.error('Upload a photo first');
//       return;
//     }

//     console.log('🩺 RUNNING FACE RECOGNITION DIAGNOSTICS');
    
//     const photo = uploadedPhotos[0];
//     const img = new Image();
//     img.src = photo.preview;
    
//     img.onload = async () => {
//       const diagnostics = {
//         imageInfo: {
//           width: img.width,
//           height: img.height,
//           aspectRatio: img.width / img.height
//         },
//         modelsLoaded: false,
//         faceDetection: null,
//         userDescriptor: null
//       };

//       try {
//         // Test model loading
//         await faceRecognitionService.loadModels();
//         diagnostics.modelsLoaded = true;
        
//         // Test face detection
//         const faces = await faceRecognitionService.detectFaces(img);
//         diagnostics.faceDetection = {
//           faceCount: faces.length,
//           details: faces.map((face, i) => ({
//             faceIndex: i,
//             confidence: face.detection.score,
//             box: face.detection.box
//           }))
//         };
        
//         // Test user descriptor
//         const userDesc = await faceService.getUserDescriptor(user.uid);
//         diagnostics.userDescriptor = {
//           exists: !!userDesc,
//           length: userDesc ? userDesc.length : 0
//         };
        
//       } catch (error) {
//         diagnostics.error = error.message;
//       }
      
//       setDiagnostics(diagnostics);
//       console.log('📊 DIAGNOSTICS RESULTS:', diagnostics);
//     };
//   };

//   return (
//     <div className="bg-slate-800/50 rounded-2xl p-6 mt-6">
//       <h3 className="text-xl font-bold text-white mb-4">Face Recognition Diagnostics</h3>
//       <button 
//         onClick={runDiagnostics}
//         className="px-4 py-2 bg-orange-500 rounded-lg text-white font-semibold hover:bg-orange-600 transition mb-4"
//       >
//         Run Diagnostics
//       </button>
      
//       {diagnostics && (
//         <div className="text-sm text-white space-y-2">
//           <div>Image: {diagnostics.imageInfo.width}x{diagnostics.imageInfo.height}</div>
//           <div>Models Loaded: {diagnostics.modelsLoaded ? '✅' : '❌'}</div>
//           <div>Faces Detected: {diagnostics.faceDetection?.faceCount || 0}</div>
//           <div>User Descriptor: {diagnostics.userDescriptor?.exists ? '✅' : '❌'}</div>
//           {diagnostics.error && <div className="text-red-400">Error: {diagnostics.error}</div>}
//         </div>
//       )}
//     </div>
//   );
// };
//   // Enhanced photo upload with face recognition
//   const onDrop = async (acceptedFiles) => {
//     setProcessing(true);
    
//     try {
//       const photos = await Promise.all(
//         acceptedFiles.map(file => {
//           return new Promise((resolve) => {
//             const reader = new FileReader();
//             reader.onload = (e) => resolve({
//               file,
//               preview: e.target.result,
//               id: Math.random().toString(36).substr(2, 9),
//               status: 'uploaded',
//               uploadTime: new Date()
//             });
//             reader.readAsDataURL(file);
//           });
//         })
//       );

//       setUploadedPhotos(prev => [...prev, ...photos]);
      
//       // Process each photo for face recognition
//       for (const photo of photos) {
//         await processPhotoForFaces(photo);
//       }

//       toast.success(`Processed ${acceptedFiles.length} photos successfully!`);
      
//     } catch (error) {
//       toast.error('Error processing photos');
//       console.error('Processing error:', error);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // const processPhotoForFaces = async (photo) => {
//   //   try {
//   //     const result = await faceService.processGroupPhoto(photo.preview, user.uid);
      
//   //     if (result.matches.length > 0) {
//   //       const newMatch = {
//   //         id: Math.random().toString(36).substr(2, 9),
//   //         groupPhoto: photo.preview,
//   //         matchedUsers: result.matches.map(match => ({
//   //           name: match.userName,
//   //           confidence: match.confidence,
//   //           profilePhoto: match.isCurrentUser ? user.profilePhoto : null,
//   //           isCurrentUser: match.isCurrentUser
//   //         })),
//   //         totalFaces: result.totalFaces,
//   //         matchedFaces: result.matchedFaces,
//   //         processedAt: new Date(),
//   //         analysis: {
//   //           faceCount: result.totalFaces,
//   //           matchRate: (result.matchedFaces / result.totalFaces * 100).toFixed(1)
//   //         }
//   //       };

//   //       setMatches(prev => [newMatch, ...prev]);
//   //       setAnalytics(prev => ({
//   //         totalPhotos: prev.totalPhotos + 1,
//   //         totalMatches: prev.totalMatches + result.matches.length,
//   //         accuracy: ((prev.totalMatches + result.matches.length) / (prev.totalPhotos + 1) * 10).toFixed(1)
//   //       }));

//   //       toast.success(`Found ${result.matches.length} matches in photo!`);
//   //     } else {
//   //       // Fixed: Use regular toast instead of toast.info
//   //       toast('No face matches found in this photo', {
//   //         icon: '🔍',
//   //         style: {
//   //           background: '#3b82f6',
//   //           color: 'white',
//   //         }
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error('Face processing error:', error);
//   //     toast.error('Failed to analyze faces in photo');
//   //   }
//   // };
// // REPLACE the processPhotoForFaces function in Dashboard.jsx:

// // In your Dashboard.jsx, replace the processPhotoForFaces function:
// const processPhotoForFaces = async (photo) => {
//   setProcessing(true);
//   try {
//     console.log('🔄 Processing photo for faces...');
    
//     const result = await faceService.processGroupPhoto(photo.preview, user.uid);
//     console.log('📊 Result:', result);

//     if (result.matches && result.matches.length > 0) {
//       const newMatch = {
//         id: Math.random().toString(36).substr(2, 9),
//         groupPhoto: photo.preview,
//         matchedUsers: result.matches.map(match => ({
//           name: match.userName,
//           confidence: match.confidence,
//           profilePhoto: match.isCurrentUser ? user.profilePhoto : null,
//           isCurrentUser: match.isCurrentUser
//         })),
//         totalFaces: result.totalFaces,
//         matchedFaces: result.matchedFaces,
//         processedAt: new Date(),
//         analysis: {
//           faceCount: result.totalFaces,
//           matchRate: (result.matchedFaces / result.totalFaces * 100).toFixed(1)
//         }
//       };

//       setMatches(prev => [newMatch, ...prev]);
//       setAnalytics(prev => ({
//         totalPhotos: prev.totalPhotos + 1,
//         totalMatches: prev.totalMatches + result.matches.length,
//         accuracy: 85
//       }));

//       toast.success(`✅ Found ${result.matches.length} matches!`);
//     } else {
//       // FIXED: Use regular toast instead of toast.info
//       if (result.message === 'User face not registered. Please add a profile photo first.') {
//         toast.error('🔍 Please add a profile photo with your face first!');
//       } else if (result.totalFaces === 0) {
//         toast.error('❌ No faces detected in this photo');
//       } else {
//         toast('👥 No matches found in this photo', {
//           icon: '🔍',
//           style: {
//             background: '#3b82f6',
//             color: 'white',
//           }
//         });
//       }
//     }
//   } catch (error) {
//     console.error('❌ Processing error:', error);
//     toast.error('Failed to process photo');
//   } finally {
//     setProcessing(false);
//   }
// };

// const registerMyFace = async () => {
//   if (!user?.profilePhoto) {
//     toast.error('Please add a profile photo first in your account settings');
//     return;
//   }

//   setProcessing(true);
//   try {
//     console.log('📸 Registering face from profile photo...');
//     const success = await faceService.registerUserFace(user.uid, user.profilePhoto);
    
//     if (success) {
//       toast.success('✅ Face registered successfully! Now try uploading photos.');
//     } else {
//       toast.error('❌ Failed to register face. Please try a different photo.');
//     }
//   } catch (error) {
//     console.error('Face registration error:', error);
//     toast.error('Failed to register face');
//   } finally {
//     setProcessing(false);
//   }
// };



// // Add this function to your Dashboard component
// const testFaceDetection = async () => {
//   if (uploadedPhotos.length === 0) {
//     toast.error('Please upload a photo first');
//     return;
//   }

//   try {
//     const photo = uploadedPhotos[0];
//     console.log('🧪 Testing face detection on uploaded photo...');
    
//     // Test basic face detection
//     const img = new Image();
//     img.src = photo.preview;
    
//     img.onload = async () => {
//       try {
//         console.log('Image dimensions:', img.width, 'x', img.height);
        
//         // Test with face-api.js directly
//         const detections = await faceapi.detectAllFaces(img, 
//           new faceapi.TinyFaceDetectorOptions({ 
//             inputSize: 320, 
//             scoreThreshold: 0.3  // Lower threshold
//           })
//         );
        
//         console.log('Face detection result:', detections);
//         console.log('Number of faces detected:', detections.length);
        
//         if (detections.length > 0) {
//           toast.success(`✅ Detected ${detections.length} faces!`);
//         } else {
//           toast.error('❌ No faces detected with current settings');
//         }
//       } catch (error) {
//         console.error('Face detection test failed:', error);
//         toast.error('Face detection test failed');
//       }
//     };
//   } catch (error) {
//     console.error('Test failed:', error);
//   }
// };

// const checkUserFaceRegistration = async () => {
//   console.log('👤 User Info:', {
//     uid: user?.uid,
//     hasProfilePhoto: !!user?.profilePhoto,
//     profilePhotoLength: user?.profilePhoto?.length
//   });
  
//   const descriptor = await faceService.getUserDescriptor(user.uid);
//   console.log('📊 Face Descriptor in DB:', !!descriptor);
  
//   if (descriptor) {
//     toast.success('✅ Face is registered in database!');
//   } else {
//     toast.error('❌ No face descriptor found in database');
//   }
// };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png']
//     },
//     multiple: true,
//     maxSize: 10 * 1024 * 1024 // 10MB
//   });

//   const sharePhoto = async (matchId) => {
//     const match = matches.find(m => m.id === matchId);
//     if (match) {
//       // Simulate sharing functionality
//       const sharePromises = match.matchedUsers.map(async (userMatch) => {
//         // In real app, this would send email/notification
//         await new Promise(resolve => setTimeout(resolve, 500));
//         return userMatch.name;
//       });

//       await Promise.all(sharePromises);
//       toast.success(`Photo shared with ${match.matchedUsers.length} people!`);
//     }
//   };

//   const downloadPhoto = (photoUrl) => {
//     const link = document.createElement('a');
//     link.href = photoUrl;
//     link.download = `facefind-${Date.now()}.jpg`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     toast.success('Photo downloaded!');
//   };

//   const getConfidenceColor = (confidence) => {
//     if (confidence >= 0.9) return 'text-green-400';
//     if (confidence >= 0.7) return 'text-yellow-400';
//     return 'text-orange-400';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
//       <Toaster 
//         position="top-right"
//         toastOptions={{
//           duration: 4000,
//           style: {
//             background: '#1e293b',
//             color: 'white',
//             border: '1px solid #334155'
//           },
//           success: {
//             style: {
//               background: '#059669',
//               color: 'white',
//             }
//           },
//           error: {
//             style: {
//               background: '#dc2626',
//               color: 'white',
//             }
//           }
//         }}
//       />
      
//       {/* Navigation */}
//       <nav className="bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-700/50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                 <Camera className="w-6 h-6 text-white" />
//               </div>
//               <span className="text-xl font-bold text-white">FaceFind Pro</span>
//             </div>
            
//             <div className="flex items-center space-x-6">
//               {/* Quick Stats */}
//               <div className="hidden md:flex items-center space-x-4 text-sm">
//                 <div className="text-center">
//                   <div className="text-white font-bold">{analytics.totalPhotos}</div>
//                   <div className="text-gray-400">Photos</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-green-400 font-bold">{analytics.totalMatches}</div>
//                   <div className="text-gray-400">Matches</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-purple-400 font-bold">{analytics.accuracy}%</div>
//                   <div className="text-gray-400">Accuracy</div>
//                 </div>
//               </div>

//               <div className="flex items-center space-x-3">
//                 {user?.profilePhoto ? (
//                   <img src={user.profilePhoto} alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-500" />
//                 ) : (
//                   <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//                     <User className="w-4 h-4 text-white" />
//                   </div>
//                 )}
//                 <span className="text-white hidden md:block">Hello, {user?.name}</span>
//               </div>
              
//               <button 
//                 onClick={handleLogout}
//                 className="px-4 py-2 text-purple-400 hover:text-purple-300 transition border border-purple-500/30 rounded-lg hover:bg-purple-500/10"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Dashboard Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Enhanced Tab Navigation */}
//         <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/50 rounded-xl p-1 w-fit mx-auto">
//           {[
//             { id: 'upload', icon: Upload, label: 'Upload Photos' },
//             { id: 'matches', icon: Users, label: `Matches ${matches.length > 0 ? `(${matches.length})` : ''}` },
//             { id: 'analytics', icon: Zap, label: 'Analytics' },
//             { id: 'history', icon: History, label: 'History' },
//             { id: 'account', icon: Settings, label: 'Account' }
//           ].map(({ id, icon: Icon, label }) => (
//             <button
//               key={id}
//               onClick={() => setActiveTab(id)}
//               className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
//                 activeTab === id
//                   ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
//                   : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
//               }`}
//             >
//               <Icon className="w-4 h-4" />
//               {label}
//             </button>
//           ))}
//         </div>

//         {/* Upload Tab */}
//         {activeTab === 'upload' && (
//           <div className="space-y-8">
//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-bold text-white mb-4">AI Face Recognition</h1>
//               <p className="text-xl text-gray-400">Upload group photos and let our AI find people automatically</p>
//             </div>

//             {/* Upload Zone */}
//             <div className="grid lg:grid-cols-2 gap-8">
//               <div
//                 {...getRootProps()}
//                 className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
//                   isDragActive
//                     ? 'border-purple-500 bg-purple-500/10 scale-105'
//                     : 'border-slate-600 hover:border-purple-500'
//                 } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 <input {...getInputProps()} disabled={processing} />
//                 <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-2xl font-bold text-white mb-2">
//                   {isDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
//                 </h3>
//                 <p className="text-gray-400 mb-4">or click to browse files</p>
//                 <p className="text-sm text-gray-500">Supports JPG, PNG • Max 10MB per photo</p>
                
//                 {processing && (
//                   <div className="mt-6">
//                     <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//                     <p className="text-purple-400 mt-2">Processing faces...</p>
//                   </div>
//                 )}
//                 <FaceRecognitionDiagnostics />
//                 <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
//   <div className="flex items-center justify-between">
//     <div>
//       <h4 className="text-white font-semibold">Face Registration Required</h4>
//       <p className="text-purple-300 text-sm">Register your face to enable recognition</p>
//     </div>
//     <button
//       onClick={registerMyFace}
//       disabled={processing}
//       className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50"
//     >
//       {processing ? 'Registering...' : 'Register My Face'}
//     </button>
//     <button
//   onClick={checkUserFaceRegistration}
//   className="px-3 py-1 bg-gray-500 rounded text-white text-sm hover:bg-gray-600 transition"
// >
//   Check Registration
// </button>
//   </div>
// </div>
//               </div>

//               {/* Upload Stats */}
//               <div className="bg-slate-800/50 rounded-2xl p-8">
//                 <h3 className="text-2xl font-bold text-white mb-6">Upload Stats</h3>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
//                     <span className="text-gray-400">Total Photos</span>
//                     <span className="text-white font-bold text-xl">{uploadedPhotos.length}</span>
//                   </div>
//                   <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
//                     <span className="text-gray-400">Successful Matches</span>
//                     <span className="text-green-400 font-bold text-xl">{matches.length}</span>
//                   </div>
//                   <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
//                     <span className="text-gray-400">Recognition Accuracy</span>
//                     <span className="text-purple-400 font-bold text-xl">{analytics.accuracy}%</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Uploaded Photos Grid */}
//             {uploadedPhotos.length > 0 && (
//               <div>
//                 <h3 className="text-2xl font-bold text-white mb-6">Recent Uploads</h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//                   {uploadedPhotos.slice(0, 10).map((photo) => (
//                     <div key={photo.id} className="relative group">
//                       <img
//                         src={photo.preview}
//                         alt="Uploaded"
//                         className="w-full h-32 object-cover rounded-lg"
//                       />
//                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
//                         <div className="text-center text-white">
//                           <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-400" />
//                           <span className="text-xs">Processed</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Matches Tab - Enhanced */}
//         {activeTab === 'matches' && (
//           <div className="space-y-8">
//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-bold text-white mb-4">Face Matches</h1>
//               <p className="text-xl text-gray-400">AI-powered face recognition results</p>
//             </div>

//             {matches.length === 0 ? (
//               <div className="bg-slate-800/50 rounded-2xl p-12 text-center">
//                 <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-2xl font-bold text-white mb-2">No matches yet</h3>
//                 <p className="text-gray-400 mb-6">Upload some group photos to find people automatically!</p>
//                 <button 
//                   onClick={() => setActiveTab('upload')}
//                   className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
//                 >
//                   Upload Photos
//                 </button>
//               </div>
//             ) : (
//               <div className="grid gap-6">
//                 {matches.map((match) => (
//                   <div key={match.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
//                     <div className="flex flex-col lg:flex-row gap-6">
//                       {/* Group Photo with Stats */}
//                       <div className="lg:w-2/5">
//                         <div className="relative">
//                           <img
//                             src={match.groupPhoto}
//                             alt="Group"
//                             className="w-full h-64 object-cover rounded-lg"
//                           />
//                           <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-2 text-white text-sm">
//                             👥 {match.analysis.faceCount} faces
//                           </div>
//                           <div className="absolute top-4 right-4 bg-green-500/90 rounded-lg px-3 py-2 text-white text-sm">
//                             ✅ {match.analysis.matchRate}% match rate
//                           </div>
//                         </div>
//                       </div>
                      
//                       {/* Match Details */}
//                       <div className="lg:w-3/5">
//                         <div className="flex justify-between items-start mb-4">
//                           <div>
//                             <h3 className="text-xl font-bold text-white">Face Recognition Results</h3>
//                             <p className="text-gray-400 text-sm">
//                               Processed {new Date(match.processedAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => downloadPhoto(match.groupPhoto)}
//                               className="px-4 py-2 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition flex items-center gap-2"
//                             >
//                               <Download className="w-4 h-4" />
//                               Download
//                             </button>
//                             <button
//                               onClick={() => sharePhoto(match.id)}
//                               className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2"
//                             >
//                               <Share2 className="w-4 h-4" />
//                               Share
//                             </button>
//                           </div>
//                         </div>
                        
//                         <div className="space-y-3 mb-4">
//                           <h4 className="text-lg font-semibold text-white">Identified People:</h4>
//                           {match.matchedUsers.map((userMatch, index) => (
//                             <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
//                               <div className="flex items-center space-x-3">
//                                 {userMatch.profilePhoto ? (
//                                   <img src={userMatch.profilePhoto} alt={userMatch.name} className="w-10 h-10 rounded-full" />
//                                 ) : (
//                                   <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//                                     <User className="w-5 h-5 text-white" />
//                                   </div>
//                                 )}
//                                 <div>
//                                   <span className="text-white font-medium block">{userMatch.name}</span>
//                                   {userMatch.isCurrentUser && (
//                                     <span className="text-purple-400 text-xs">You</span>
//                                   )}
//                                 </div>
//                               </div>
//                               <div className="text-right">
//                                 <span className={`font-bold ${getConfidenceColor(userMatch.confidence)}`}>
//                                   {(userMatch.confidence * 100).toFixed(1)}%
//                                 </span>
//                                 <div className="text-xs text-gray-400">Confidence</div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Match Quality Indicator */}
//                         <div className="bg-slate-700/30 rounded-lg p-4">
//                           <div className="flex justify-between items-center mb-2">
//                             <span className="text-gray-400">Match Quality</span>
//                             <span className="text-green-400 font-semibold">
//                               {Math.max(...match.matchedUsers.map(m => m.confidence * 100)).toFixed(1)}%
//                             </span>
//                           </div>
//                           <div className="w-full bg-slate-600 rounded-full h-2">
//                             <div 
//                               className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all"
//                               style={{ width: `${Math.max(...match.matchedUsers.map(m => m.confidence * 100))}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Analytics Tab */}
//         {activeTab === 'analytics' && (
//           <div className="space-y-8">
//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-bold text-white mb-4">Analytics Dashboard</h1>
//               <p className="text-xl text-gray-400">Track your face recognition performance</p>
//             </div>

//             {/* Analytics Cards */}
//             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20">
//                 <div className="text-3xl font-bold text-white mb-2">{analytics.totalPhotos}</div>
//                 <div className="text-gray-400">Photos Processed</div>
//                 <div className="text-green-400 text-sm mt-2">+12% this week</div>
//               </div>
              
//               <div className="bg-slate-800/50 rounded-2xl p-6 border border-green-500/20">
//                 <div className="text-3xl font-bold text-white mb-2">{analytics.totalMatches}</div>
//                 <div className="text-gray-400">Total Matches</div>
//                 <div className="text-green-400 text-sm mt-2">+8% this week</div>
//               </div>
              
//               <div className="bg-slate-800/50 rounded-2xl p-6 border border-blue-500/20">
//                 <div className="text-3xl font-bold text-white mb-2">{analytics.accuracy}%</div>
//                 <div className="text-gray-400">Accuracy Rate</div>
//                 <div className="text-green-400 text-sm mt-2">+2.5% improved</div>
//               </div>
              
//               <div className="bg-slate-800/50 rounded-2xl p-6 border border-pink-500/20">
//                 <div className="text-3xl font-bold text-white mb-2">{matches.length}</div>
//                 <div className="text-gray-400">Active Matches</div>
//                 <div className="text-green-400 text-sm mt-2">Ready to share</div>
//               </div>
//             </div>

//             {/* Additional Analytics Content */}
//             <div className="grid lg:grid-cols-2 gap-8">
//               <div className="bg-slate-800/50 rounded-2xl p-6">
//                 <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
//                 <div className="space-y-3">
//                   {matches.slice(0, 5).map((match, index) => (
//                     <div key={match.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
//                       <div className="flex items-center space-x-3">
//                         <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//                           <Users className="w-4 h-4 text-white" />
//                         </div>
//                         <span className="text-white">
//                           Found {match.matchedUsers.length} matches
//                         </span>
//                       </div>
//                       <span className="text-gray-400 text-sm">
//                         {new Date(match.processedAt).toLocaleTimeString()}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-slate-800/50 rounded-2xl p-6">
//                 <h3 className="text-xl font-bold text-white mb-4">Performance Metrics</h3>
//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex justify-between text-sm text-gray-400 mb-1">
//                       <span>Face Detection</span>
//                       <span>95%</span>
//                     </div>
//                     <div className="w-full bg-slate-700 rounded-full h-2">
//                       <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-sm text-gray-400 mb-1">
//                       <span>Recognition Accuracy</span>
//                       <span>88%</span>
//                     </div>
//                     <div className="w-full bg-slate-700 rounded-full h-2">
//                       <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }}></div>
//                     </div>
//                   </div>
//                   <div>
//                     <div className="flex justify-between text-sm text-gray-400 mb-1">
//                       <span>Processing Speed</span>
//                       <span>2.1s/photo</span>
//                     </div>
//                     <div className="w-full bg-slate-700 rounded-full h-2">
//                       <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* History Tab */}
//         {activeTab === 'history' && (
//           <div className="space-y-8">
//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-bold text-white mb-4">Processing History</h1>
//               <p className="text-xl text-gray-400">View your previous face recognition sessions</p>
//             </div>

//             {uploadedPhotos.length === 0 ? (
//               <div className="bg-slate-800/50 rounded-2xl p-12 text-center">
//                 <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-2xl font-bold text-white mb-2">No history yet</h3>
//                 <p className="text-gray-400 mb-6">Start by uploading some photos to see your processing history!</p>
//                 <button 
//                   onClick={() => setActiveTab('upload')}
//                   className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
//                 >
//                   Upload Photos
//                 </button>
//               </div>
//             ) : (
//               <div className="bg-slate-800/50 rounded-2xl p-6">
//                 <h3 className="text-2xl font-bold text-white mb-6">Recent Uploads</h3>
//                 <div className="space-y-4">
//                   {uploadedPhotos.map((photo, index) => (
//                     <div key={photo.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
//                       <div className="flex items-center space-x-4">
//                         <img
//                           src={photo.preview}
//                           alt="Uploaded"
//                           className="w-16 h-16 object-cover rounded-lg"
//                         />
//                         <div>
//                           <div className="text-white font-medium">Photo {index + 1}</div>
//                           <div className="text-gray-400 text-sm">
//                             Uploaded {photo.uploadTime.toLocaleDateString()} at {photo.uploadTime.toLocaleTimeString()}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-green-400 font-semibold">Processed</div>
//                         <div className="text-gray-400 text-sm">Ready</div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Account Tab */}
//         {activeTab === 'account' && (
//           <div className="max-w-2xl mx-auto">
//             <div className="text-center mb-8">
//               <h1 className="text-4xl font-bold text-white mb-4">Account Settings</h1>
//               <p className="text-xl text-gray-400">Manage your profile and preferences</p>
//             </div>

//             <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
//               <div className="flex items-center space-x-6 mb-8">
//                 {user?.profilePhoto ? (
//                   <img src={user.profilePhoto} alt="Profile" className="w-20 h-20 rounded-full border-2 border-purple-500" />
//                 ) : (
//                   <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
//                     <User className="w-10 h-10 text-white" />
//                   </div>
//                 )}
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
//                   <p className="text-gray-400">{user?.email}</p>
//                   <button className="mt-2 text-purple-400 hover:text-purple-300 text-sm">
//                     Change Profile Photo
//                   </button>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <div className="p-4 bg-slate-700/30 rounded-lg">
//                     <div className="text-gray-400 text-sm mb-1">Plan</div>
//                     <div className="text-white font-semibold capitalize">{user?.plan}</div>
//                   </div>
//                   <div className="p-4 bg-slate-700/30 rounded-lg">
//                     <div className="text-gray-400 text-sm mb-1">Status</div>
//                     <div className="text-green-400 font-semibold">Active</div>
//                   </div>
//                 </div>

//                 <div className="p-4 bg-slate-700/30 rounded-lg">
//                   <div className="text-gray-400 text-sm mb-1">Email</div>
//                   <div className="text-white">{user?.email}</div>
//                 </div>

//                 <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-700/30 rounded-lg">
//                   <div>
//                     <div className="text-gray-400 text-sm mb-1">Photos Processed</div>
//                     <div className="text-white font-semibold">{uploadedPhotos.length}</div>
//                   </div>
//                   <div>
//                     <div className="text-gray-400 text-sm mb-1">Successful Matches</div>
//                     <div className="text-green-400 font-semibold">{matches.length}</div>
//                   </div>
//                   <div>
//                     <div className="text-gray-400 text-sm mb-1">Member since</div>
//                     <div className="text-white">Today</div>
//                   </div>
//                 </div>

//                 <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
//                   Upgrade Plan
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // CheckCircle component
// const CheckCircle = ({ className }) => (
//   <svg className={className} fill="currentColor" viewBox="0 0 20 20">
//     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//   </svg>
// );

// export default Dashboard;




import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Upload, Search, Bell, User, Download, Share2, 
  Users, Zap, Settings, History, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useDropzone } from 'react-dropzone';
import { faceService } from '../../services/faceService';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [matches, setMatches] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalPhotos: 0,
    totalMatches: 0,
    accuracy: 0
  });

  useEffect(() => {
    faceService.initialize().catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Face Registration Functions
  const registerMyFace = async () => {
    if (!user?.profilePhoto) {
      toast.error('Please add a profile photo first in your account settings');
      return;
    }

    setProcessing(true);
    try {
      const success = await faceService.registerUserFace(user.uid, user.profilePhoto);
      if (success) {
        toast.success('✅ Face registered successfully! Now try uploading photos.');
      } else {
        toast.error('❌ Failed to register face. Please try a different photo.');
      }
    } catch (error) {
      console.error('Face registration error:', error);
      toast.error('Failed to register face: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  const checkUserFaceRegistration = async () => {
    const descriptor = await faceService.getUserDescriptor(user.uid);
    if (descriptor) {
      toast.success('✅ Face is registered in database!');
    } else {
      toast.error('❌ No face descriptor found in database');
    }
  };

  // Photo Processing Functions
  const onDrop = async (acceptedFiles) => {
    setProcessing(true);
    
    try {
      const photos = await Promise.all(
        acceptedFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({
              file,
              preview: e.target.result,
              id: Math.random().toString(36).substr(2, 9),
              status: 'uploaded',
              uploadTime: new Date()
            });
            reader.readAsDataURL(file);
          });
        })
      );

      setUploadedPhotos(prev => [...prev, ...photos]);
      
      for (const photo of photos) {
        await processPhotoForFaces(photo);
      }

      toast.success(`Processed ${acceptedFiles.length} photos successfully!`);
    } catch (error) {
      toast.error('Error processing photos');
      console.error('Processing error:', error);
    } finally {
      setProcessing(false);
    }
  };

  // const processPhotoForFaces = async (photo) => {
  //   try {
  //     const result = await faceService.processGroupPhoto(photo.preview, user.uid);

  //     if (result.matches && result.matches.length > 0) {
  //       const newMatch = {
  //         id: Math.random().toString(36).substr(2, 9),
  //         groupPhoto: photo.preview,
  //         matchedUsers: result.matches.map(match => ({
  //           name: match.userName,
  //           confidence: match.confidence,
  //           profilePhoto: match.isCurrentUser ? user.profilePhoto : null,
  //           isCurrentUser: match.isCurrentUser
  //         })),
  //         totalFaces: result.totalFaces,
  //         matchedFaces: result.matchedFaces,
  //         processedAt: new Date(),
  //         analysis: {
  //           faceCount: result.totalFaces,
  //           matchRate: (result.matchedFaces / result.totalFaces * 100).toFixed(1)
  //         }
  //       };

  //       setMatches(prev => [newMatch, ...prev]);
  //       setAnalytics(prev => ({
  //         totalPhotos: prev.totalPhotos + 1,
  //         totalMatches: prev.totalMatches + result.matches.length,
  //         accuracy: Math.min(100, prev.accuracy + 5) // Increment accuracy for demo
  //       }));

  //       toast.success(`✅ Found ${result.matches.length} matches!`);
  //     } else {
  //       if (result.message === 'User face not registered. Please add a profile photo first.') {
  //         toast.error('🔍 Please register your face first!');
  //       } else if (result.totalFaces === 0) {
  //         toast.error('❌ No faces detected in this photo');
  //       } else {
  //         toast('👥 No matches found in this photo', {
  //           icon: '🔍',
  //           style: {
  //             background: '#3b82f6',
  //             color: 'white',
  //           }
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error('❌ Processing error:', error);
  //     toast.error('Failed to process photo');
  //   }
  // };


const processPhotoForFaces = async (photo) => {
  try {
    const result = await faceService.processGroupPhoto(photo.preview, user.uid);

    if (result.matches && result.matches.length > 0) {
      // Filter matches with confidence >= 30% (0.3)
      const highConfidenceMatches = result.matches.filter(match => match.confidence >= 0.2);
      
      if (highConfidenceMatches.length > 0) {
        const newMatch = {
          id: Math.random().toString(36).substr(2, 9),
          groupPhoto: photo.preview,
          matchedUsers: highConfidenceMatches.map(match => ({
            name: match.userName,
            confidence: match.confidence,
            profilePhoto: match.isCurrentUser ? user.profilePhoto : null,
            isCurrentUser: match.isCurrentUser
          })),
          totalFaces: result.totalFaces,
          matchedFaces: highConfidenceMatches.length, // Use filtered count
          processedAt: new Date(),
          analysis: {
            faceCount: result.totalFaces,
            matchRate: (highConfidenceMatches.length / result.totalFaces * 100).toFixed(1)
          }
        };

        setMatches(prev => [newMatch, ...prev]);
        setAnalytics(prev => ({
          totalPhotos: prev.totalPhotos + 1,
          totalMatches: prev.totalMatches + highConfidenceMatches.length,
          accuracy: Math.min(100, prev.accuracy + 5)
        }));

        toast.success(`✅ Found ${highConfidenceMatches.length} high-confidence matches!`);
      } else {
        toast('🔍 Found matches but below confidence threshold', {
          icon: '📊',
          style: {
            background: '#f59e0b',
            color: 'white',
          }
        });
      }
    } else {
      if (result.message === 'User face not registered. Please add a profile photo first.') {
        toast.error('🔍 Please register your face first!');
      } else if (result.totalFaces === 0) {
        toast.error('❌ No faces detected in this photo');
      } else {
        toast('👥 No high-confidence matches found', {
          icon: '📈',
          style: {
            background: '#3b82f6',
            color: 'white',
          }
        });
      }
    }
  } catch (error) {
    console.error('❌ Processing error:', error);
    toast.error('Failed to process photo');
  }
};


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024
  });

  // Utility Functions
  const sharePhoto = async (matchId) => {
    const match = matches.find(m => m.id === matchId);
    if (match) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Photo shared with ${match.matchedUsers.length} people!`);
    }
  };

  const downloadPhoto = (photoUrl) => {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `facefind-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Photo downloaded!');
  };

  const getConfidenceColor = (confidence) => {
  if (confidence >= 0.8) return 'text-green-400';
  if (confidence >= 0.6) return 'text-yellow-400';
  if (confidence >= 0.2) return 'text-orange-400';
  return 'text-red-400'; // Below 30% - shouldn't show due to filter
};
  // Tab Configuration
  const tabs = [
    { id: 'upload', icon: Upload, label: 'Upload Photos' },
    { id: 'matches', icon: Users, label: `Matches ${matches.length > 0 ? `(${matches.length})` : ''}` },
    { id: 'analytics', icon: Zap, label: 'Analytics' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'account', icon: Settings, label: 'Account' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: 'white',
            border: '1px solid #334155'
          },
          success: {
            style: {
              background: '#059669',
              color: 'white',
            }
          },
          error: {
            style: {
              background: '#dc2626',
              color: 'white',
            }
          }
        }}
      />
      
      {/* Navigation */}
      <nav className="bg-slate-900/95 backdrop-blur-lg shadow-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FaceFind Pro</span>
            </div>
            
            <div className="flex items-center space-x-6">
           

              <div className="flex items-center space-x-3">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-8 h-8 rounded-full border-2 border-purple-500" />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-white hidden md:block">Hello, {user?.name}</span>
              </div>
              
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-purple-400 hover:text-purple-300 transition border border-purple-500/30 rounded-lg hover:bg-purple-500/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/50 rounded-xl p-1 w-fit mx-auto">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">AI Face Recognition</h1>
              <p className="text-xl text-gray-400">Upload group photos and let our AI find people automatically</p>
            </div>

            {/* Face Registration Banner */}
            {/* <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <h4 className="text-white font-semibold text-lg">Face Registration Required</h4>
                  <p className="text-purple-300">Register your face to enable AI recognition</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={registerMyFace}
                    disabled={processing}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Registering...
                      </>
                    ) : (
                      'Register My Face'
                    )}
                  </button>
                  <button
                    onClick={checkUserFaceRegistration}
                    className="px-4 py-3 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition"
                  >
                    Check Status
                  </button>
                </div>
              </div>
            </div> */}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Zone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-purple-500 bg-purple-500/10 scale-105'
                    : 'border-slate-600 hover:border-purple-500'
                } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input {...getInputProps()} disabled={processing} />
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isDragActive ? 'Drop photos here' : 'Drag & drop photos here'}
                </h3>
                <p className="text-gray-400 mb-4">or click to browse files</p>
                <p className="text-sm text-gray-500">Supports JPG, PNG • Max 10MB per photo</p>
                
                {processing && (
                  <div className="mt-6">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-purple-400 mt-2">Processing faces...</p>
                  </div>
                )}
              </div>

              {/* Upload Stats */}
              <div className="bg-slate-800/50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Upload Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                    <span className="text-gray-400">Total Photos</span>
                    <span className="text-white font-bold text-xl">{uploadedPhotos.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                    <span className="text-gray-400">Successful Matches</span>
                    <span className="text-green-400 font-bold text-xl">{matches.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-700/30 rounded-lg">
                    <span className="text-gray-400">Recognition Accuracy</span>
                    <span className="text-purple-400 font-bold text-xl">{analytics.accuracy}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Photos Grid */}
            {uploadedPhotos.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Recent Uploads</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {uploadedPhotos.slice(0, 10).map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.preview}
                        alt="Uploaded"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="text-center text-white">
                          <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-400" />
                          <span className="text-xs">Processed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Face Matches</h1>
              <p className="text-xl text-gray-400">AI-powered face recognition results</p>
            </div>

            {matches.length === 0 ? (
              <div className="bg-slate-800/50 rounded-2xl p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No matches yet</h3>
                <p className="text-gray-400 mb-6">Upload some group photos to find people automatically!</p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Upload Photos
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {matches.map((match) => (
                  <div key={match.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-2/5">
                        <div className="relative">
                          <img
                            src={match.groupPhoto}
                            alt="Group"
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-2 text-white text-sm">
                            👥 {match.analysis.faceCount} faces
                          </div>
                          <div className="absolute top-4 right-4 bg-green-500/90 rounded-lg px-3 py-2 text-white text-sm">
                            ✅ {match.analysis.matchRate}% match rate
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:w-3/5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">Face Recognition Results</h3>
                            <p className="text-gray-400 text-sm">
                              Processed {new Date(match.processedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => downloadPhoto(match.groupPhoto)}
                              className="px-4 py-2 bg-slate-700 rounded-lg text-white hover:bg-slate-600 transition flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                            <button
                              onClick={() => sharePhoto(match.id)}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2"
                            >
                              <Share2 className="w-4 h-4" />
                              Share
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <h4 className="text-lg font-semibold text-white">Identified People:</h4>
                          {match.matchedUsers.map((userMatch, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                {userMatch.profilePhoto ? (
                                  <img src={userMatch.profilePhoto} alt={userMatch.name} className="w-10 h-10 rounded-full" />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                  </div>
                                )}
                                <div>
                                  <span className="text-white font-medium block">{userMatch.name}</span>
                                  {userMatch.isCurrentUser && (
                                    <span className="text-purple-400 text-xs">You</span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`font-bold ${getConfidenceColor(userMatch.confidence)}`}>
                                  {(userMatch.confidence * 100).toFixed(1)}%
                                </span>
                                <div className="text-xs text-gray-400">Confidence</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-slate-700/30 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Match Quality</span>
                            <span className="text-green-400 font-semibold">
                              {Math.max(...match.matchedUsers.map(m => m.confidence * 100)).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.max(...match.matchedUsers.map(m => m.confidence * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Analytics Dashboard</h1>
              <p className="text-xl text-gray-400">Track your face recognition performance</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20">
                <div className="text-3xl font-bold text-white mb-2">{analytics.totalPhotos}</div>
                <div className="text-gray-400">Photos Processed</div>
                <div className="text-green-400 text-sm mt-2">+12% this week</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-green-500/20">
                <div className="text-3xl font-bold text-white mb-2">{analytics.totalMatches}</div>
                <div className="text-gray-400">Total Matches</div>
                <div className="text-green-400 text-sm mt-2">+8% this week</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-blue-500/20">
                <div className="text-3xl font-bold text-white mb-2">{analytics.accuracy}%</div>
                <div className="text-gray-400">Accuracy Rate</div>
                <div className="text-green-400 text-sm mt-2">+2.5% improved</div>
              </div>
              
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-pink-500/20">
                <div className="text-3xl font-bold text-white mb-2">{matches.length}</div>
                <div className="text-gray-400">Active Matches</div>
                <div className="text-green-400 text-sm mt-2">Ready to share</div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Processing History</h1>
              <p className="text-xl text-gray-400">View your previous face recognition sessions</p>
            </div>

            {uploadedPhotos.length === 0 ? (
              <div className="bg-slate-800/50 rounded-2xl p-12 text-center">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No history yet</h3>
                <p className="text-gray-400 mb-6">Start by uploading some photos to see your processing history!</p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  Upload Photos
                </button>
              </div>
            ) : (
              <div className="bg-slate-800/50 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6">Recent Uploads</h3>
                <div className="space-y-4">
                  {uploadedPhotos.map((photo, index) => (
                    <div key={photo.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={photo.preview}
                          alt="Uploaded"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <div className="text-white font-medium">Photo {index + 1}</div>
                          <div className="text-gray-400 text-sm">
                            Uploaded {photo.uploadTime.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-semibold">Processed</div>
                        <div className="text-gray-400 text-sm">Ready</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Account Settings</h1>
              <p className="text-xl text-gray-400">Manage your profile and preferences</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
              <div className="flex items-center space-x-6 mb-8">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-20 h-20 rounded-full border-2 border-purple-500" />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Plan</div>
                    <div className="text-white font-semibold capitalize">{user?.plan}</div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Status</div>
                    <div className="text-green-400 font-semibold">Active</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Photos Processed</div>
                    <div className="text-white font-semibold">{uploadedPhotos.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Successful Matches</div>
                    <div className="text-green-400 font-semibold">{matches.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Recognition Accuracy</div>
                    <div className="text-purple-400 font-semibold">{analytics.accuracy}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;