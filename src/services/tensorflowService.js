// Create a new file: services/tensorflowService.js
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

class TensorFlowFaceService {
  constructor() {
    this.model = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      await tf.ready();
      this.model = await blazeface.load();
      this.initialized = true;
      console.log('✅ TensorFlow.js model loaded');
    } catch (error) {
      console.error('❌ TensorFlow.js loading failed:', error);
    }
  }

  async detectFaces(imageElement) {
    if (!this.initialized) await this.initialize();
    
    try {
      const predictions = await this.model.estimateFaces(imageElement, false);
      console.log(`🔍 Found ${predictions.length} faces with TensorFlow`);
      return predictions;
    } catch (error) {
      console.error('Face detection failed:', error);
      return [];
    }
  }
}

export const tensorFlowService = new TensorFlowFaceService();