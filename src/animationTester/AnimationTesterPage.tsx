import AnimationTester from './AnimationTester';
import sampleAnimationFile from './sample_data/sampleCharacterAnimation.json'

function AnimationTesterPage() {
    return (
        <div>
            <h1>Animation Tester Page</h1>
            <AnimationTester
                animationData={sampleAnimationFile}
            />
        </div>
    );
}

export default AnimationTesterPage;