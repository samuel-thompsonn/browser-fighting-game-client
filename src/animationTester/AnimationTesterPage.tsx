import AnimationTester from './AnimationTester';
import sampleAnimationFile from '../animation/characterASimpleAnimations.json'

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