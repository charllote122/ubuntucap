from django.core.management.base import BaseCommand
from apps.ubuntucap.ml_engine.training.trainer import MLModelTrainer

class Command(BaseCommand):
    help = 'Train ML credit scoring model'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--synthetic',
            action='store_true',
            help='Use synthetic data for training'
        )
        parser.add_argument(
            '--samples',
            type=int,
            default=1000,
            help='Number of synthetic samples to generate'
        )
    
    def handle(self, *args, **options):
        self.stdout.write('🚀 Starting ML Model Training...')
        
        trainer = MLModelTrainer()
        
        # Generate synthetic data if requested
        if options['synthetic']:
            self.stdout.write(f'🤖 Generating {options["samples"]} synthetic samples...')
            trainer.generate_synthetic_data(options['samples'])
        
        # Train models
        self.stdout.write('🏋️ Training ML models...')
        result = trainer.train_models(use_synthetic=options['synthetic'])
        
        if result:
            self.stdout.write(
                self.style.SUCCESS(
                    f'✅ Training completed! Best model: {result["best_model"]} '
                    f'(R²: {result["best_score"]:.3f})'
                )
            )
            
            # Evaluate model
            self.stdout.write('📊 Evaluating model...')
            evaluation = trainer.evaluate_model()
            
            if evaluation:
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✅ Evaluation - R²: {evaluation["r2"]:.3f}, '
                        f'MAE: {evaluation["mae"]:.2f}'
                    )
                )
        else:
            self.stdout.write(self.style.ERROR('❌ Training failed!'))
