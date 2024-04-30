import { useState } from 'react';
import Button from '../component/button/Button';
import './EditorPage.css';
import AnimationFileData from '../AnimationFileData';
import CharacterVisualizer from '../CharacterVisualizer';
import EditorTester from './EditorTester';
import defaultCharacterAnimationData from '../animation/characterASimpleAnimationsSymmetrical.json';


function sendBehaviorData(behaviorData: string, gameID: string): void {
  const requestBody = {
    identityID: 'debugPlayer',
    gameID: gameID,
    behaviorData: JSON.parse(behaviorData)
  }
  fetch('http://localhost:3001/debug/update-character-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody),
  });
}

function EditorPage() {
  const [characterAnimationData, setCharacterAnimationData] = useState<string>(
    JSON.stringify(defaultCharacterAnimationData, null, 2)
  );
  const [characterBehaviorData, setCharacterBehaviorData] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | undefined>();
  const [characterVisualizer, setCharacterVisualizer] = useState<CharacterVisualizer>(new CharacterVisualizer())
  const [gameID, setGameID] = useState<string | undefined>();

  const onSubmit = () => {
    // Transform character animation data into a character locally
    // do an ugly cast
    try {
      const inputAnimationData = JSON.parse(characterAnimationData) as AnimationFileData;
      setCharacterVisualizer(new CharacterVisualizer(inputAnimationData));
    } catch (error) {
      setJsonError((error as Error).message);
    }
    // Send backend character states to the server for it to re-make the character
    if (gameID) {
      sendBehaviorData(characterBehaviorData, gameID);
    }
  }

  const handleChangeAnimationData = (animationData: string) => {
    setJsonError(undefined);
    setCharacterAnimationData(animationData);
  }

  const handleChangeBehaviorData = (behaviordata: string) => {
    setCharacterBehaviorData(behaviordata);
  }

  return (
    <div className="editor-page">
      <h1>Edit Character</h1>
      <div className="editor-page-interactions">
        <div className="editor-input-section">
          <div className="editor-text-section">
            <div>
              <p>Animation Config</p>
              <textarea
                rows={15}
                cols={50}
                className="editor-text-input"
                value={characterAnimationData}
                onChange={(event) => handleChangeAnimationData(event.target.value)}
              />
            </div>
            <div>
              <p>Behavior Config</p>
              <textarea
                rows={15}
                cols={50}
                className="editor-text-input"
                value={characterBehaviorData}
                onChange={(event) => handleChangeBehaviorData(event.target.value)}
              />
            </div>
            {jsonError ? (
              <p>{jsonError}</p>
            ) : null}
          </div>
          <Button onClick={onSubmit}>Submit</Button>
        </div>
        <EditorTester
          characterVisualizer={characterVisualizer}
          onChangeGameID={setGameID}
          characterAnimationData={JSON.parse(characterAnimationData)}
          onChangeAnimationData={(animationData) => setCharacterAnimationData(JSON.stringify(animationData, null, 2))}
        />
      </div>
    </div>
  )
}

export default EditorPage;