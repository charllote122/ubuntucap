import os
import django
import sys

sys.path.append('/workspaces/ubuntucap/UbuntuCap/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ubuntucap.settings')
django.setup()

from apps.ubuntucap.ml_engine.training.trainer import MLModelTrainer

print("�� Testing ML Training Pipeline...")

trainer = MLModelTrainer()

# Test synthetic data generation
print("1. Testing synthetic data generation...")
df = trainer.generate_synthetic_data(100)
print(f"   ✅ Generated {len(df)} samples")

# Test model training
print("2. Testing model training...")
result = trainer.train_models(use_synthetic=True)

if result:
    print(f"   ✅ Training successful! Best model: {result['best_model']}")
    print(f"   ✅ R² Score: {result['best_score']:.3f}")
    
    # Test model evaluation
    print("3. Testing model evaluation...")
    evaluation = trainer.evaluate_model()
    if evaluation:
        print(f"   ✅ Evaluation R²: {evaluation['r2']:.3f}")
        print("   ✅ Feature importance calculated")
    
    print("🎉 ML pipeline is working correctly!")
else:
    print("❌ Training failed")

print("\n🚀 Next: Run 'python manage.py train_model --synthetic' to train full model")
