import * as faceapi from "face-api.js";

class FaceRecognitionService {
  constructor() {
    this.modelsLoaded = false;
    this.minConfidence = 0.5;
  }
async loadModels() {
  if (this.modelsLoaded) return;

  try {
    const MODEL_URL = "/models";
    console.log('🔍 Loading models from:', MODEL_URL);

    // Test if models directory exists
    const testResponse = await fetch(MODEL_URL);
    if (!testResponse.ok) {
      throw new Error(`Models directory not found at ${MODEL_URL}`);
    }

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    ]);

    this.modelsLoaded = true;
    console.log('✅ ALL MODELS LOADED SUCCESSFULLY');
    
    // Test that models are working
    console.log('🧪 Testing models with blank image...');
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 100;
    testCanvas.height = 100;
    const testDetections = await faceapi.detectAllFaces(testCanvas);
    console.log('Model test completed:', testDetections.length, 'faces on blank canvas');
    
  } catch (error) {
    console.error('❌ MODEL LOADING ERROR:', error);
    throw new Error("Failed to load face recognition models: " + error.message);
  }
}
  
//   async loadModels() {
//     if (this.modelsLoaded) return;

//     try {
//       const MODEL_URL = "/models";

//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
//         faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
//         faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
//         faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
//         faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
//       ]);

//       this.modelsLoaded = true;
//       console.log("Face recognition models loaded successfully");
//     } catch (error) {
//       console.error("Error loading face recognition models:", error);
//       throw new Error("Failed to load face recognition models");
//     }
//   }

  //   async detectFaces(imageElement) {
  //     if (!this.modelsLoaded) {
  //       await this.loadModels();
  //     }

  //     try {
  //       // Use tinyFaceDetector for better performance
  //       const detectionOptions = new faceapi.TinyFaceDetectorOptions({
  //         inputSize: 512,
  //         scoreThreshold: 0.5
  //       });

  //       const detections = await faceapi
  //         .detectAllFaces(imageElement, detectionOptions)
  //         .withFaceLandmarks()
  //         .withFaceDescriptors()
  //         .withFaceExpressions();

  //       return detections;
  //     } catch (error) {
  //       console.error('Error detecting faces:', error);
  //       throw new Error('Face detection failed');
  //     }
  //   }
  // In the detectFaces function, add willReadFrequently attribute
//   async detectFaces(imageElement) {
//     if (!this.modelsLoaded) {
//       await this.loadModels();
//     }

//     try {
//       // Create a canvas with willReadFrequently attribute
//       const canvas = document.createElement("canvas");
//       canvas.willReadFrequently = true; // This fixes the warning
//       const ctx = canvas.getContext("2d", { willReadFrequently: true });

//       // Set canvas dimensions to match image
//       canvas.width = imageElement.width;
//       canvas.height = imageElement.height;

//       // Draw image to canvas
//       ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

//       // Use tinyFaceDetector for better performance
//       const detectionOptions = new faceapi.TinyFaceDetectorOptions({
//         inputSize: 320, // Reduced from 512 for better performance
//         scoreThreshold: 0.5,
//       });

//       // Detect faces from the canvas instead of directly from image
//       const detections = await faceapi
//         .detectAllFaces(canvas, detectionOptions)
//         .withFaceLandmarks()
//         .withFaceDescriptors()
//         .withFaceExpressions();

//       return detections;
//     } catch (error) {
//       console.error("Error detecting faces:", error);
//       throw new Error("Face detection failed");
//     }
//   }
async detectFaces(imageElement) {
  if (!this.modelsLoaded) {
    await this.loadModels();
  }

  try {
    console.log('🔄 Starting face detection...');
    console.log('Image dimensions:', imageElement.width, 'x', imageElement.height);

    // CREATE CANVAS FOR BETTER DETECTION
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

    console.log('Canvas created:', canvas.width, 'x', canvas.height);

    // TRY MULTIPLE DETECTION METHODS
    let detections = [];
    
    // Method 1: TinyFaceDetector (Fastest)
    console.log('Trying TinyFaceDetector...');
    const tinyOptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: 512, // Larger for better detection
      scoreThreshold: 0.1 // VERY LOW THRESHOLD
    });
    
    detections = await faceapi
      .detectAllFaces(canvas, tinyOptions)
      .withFaceLandmarks()
      .withFaceDescriptors();

    console.log('TinyFaceDetector found:', detections.length, 'faces');

    // Method 2: If no faces, try SSD Mobilenet
    if (detections.length === 0) {
      console.log('Trying SSD Mobilenet...');
      const ssdOptions = new faceapi.SsdMobilenetv1Options({
        minConfidence: 0.1 // LOW THRESHOLD
      });
      
      detections = await faceapi
        .detectAllFaces(canvas, ssdOptions)
        .withFaceLandmarks()
        .withFaceDescriptors();
        
      console.log('SSD Mobilenet found:', detections.length, 'faces');
    }

    // Method 3: If still no faces, try MTCNN (most accurate)
    if (detections.length === 0) {
      console.log('Trying MTCNN...');
      const mtcnnOptions = {
        minFaceSize: 20
      };
      
      // Note: MTCNN might not be available in all face-api.js versions
      if (faceapi.mtcnn) {
        const mtcnnResult = await faceapi.mtcnn(canvas, mtcnnOptions);
        if (mtcnnResult) {
          detections = mtcnnResult.map(result => ({
            detection: {
              score: result.score,
              box: result.box
            },
            landmarks: result.landmarks,
            descriptor: result.descriptor
          }));
        }
        console.log('MTCNN found:', detections.length, 'faces');
      }
    }

    console.log('✅ Final detection result:', detections.length, 'faces');
    
    if (detections.length === 0) {
      console.warn('❌ NO FACES DETECTED with any method');
      console.log('Image data URL (first 100 chars):', canvas.toDataURL().substring(0, 100));
    }

    return detections;
  } catch (error) {
    console.error('❌ Face detection crashed:', error);
    throw error;
  }
}

 async extractFaceDescriptor(imageElement) {
  if (!this.modelsLoaded) {
    await this.loadModels();
  }

  try {
    console.log('🔍 Extracting face descriptor from image...');
    
    // Use the same detection parameters as before
    const detectionOptions = new faceapi.TinyFaceDetectorOptions({
      inputSize: 512,
      scoreThreshold: 0.3
    });

    const detection = await faceapi
      .detectSingleFace(imageElement, detectionOptions)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detection) {
      console.log('✅ Face descriptor extracted successfully');
      return detection.descriptor;
    } else {
      console.log('❌ No face found for descriptor extraction');
      return null;
    }
  } catch (error) {
    console.error('Error extracting face descriptor:', error);
    return null;
  }
}

  calculateFaceDistance(descriptor1, descriptor2) {
    return faceapi.euclideanDistance(descriptor1, descriptor2);
  }

  isMatch(descriptor1, descriptor2, threshold = 0.6) {
    const distance = this.calculateFaceDistance(descriptor1, descriptor2);
    return {
      isMatch: distance < threshold,
      distance,
      confidence: Math.max(0, 1 - distance),
    };
  }

  async compareFacesWithGroup(groupImage, profileDescriptors) {
    try {
      const groupDetections = await this.detectFaces(groupImage);
      const matches = [];

      for (const groupFace of groupDetections) {
        let bestMatch = null;
        let bestConfidence = 0;

        for (const profile of profileDescriptors) {
          const comparison = this.isMatch(
            groupFace.descriptor,
            profile.descriptor
          );

          if (comparison.isMatch && comparison.confidence > bestConfidence) {
            bestConfidence = comparison.confidence;
            bestMatch = {
              profile: profile.user,
              confidence: comparison.confidence,
              faceLocation: groupFace.detection.box,
            };
          }
        }

        if (bestMatch && bestConfidence > this.minConfidence) {
          matches.push(bestMatch);
        }
      }

      return matches;
    } catch (error) {
      console.error("Error comparing faces:", error);
      throw new Error("Face comparison failed");
    }
  }
}

export const faceRecognitionService = new FaceRecognitionService();
