import { useState } from 'react';
import Button from '../component/button/Button';
import './EditorPage.css';
import AnimationFileData from '../AnimationFileData';
import CharacterVisualizer from '../CharacterVisualizer';
import EditorTester from './EditorTester';
import defaultCharacterAnimationData from '../animation/characterASimpleAnimationsSymmetrical.json';
import defaultCharacterBehaviorData from './sampleData/characterBehaviorData.json'


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
  const [characterAnimationSource, setCharacterAnimationData] = useState<string>(
    JSON.stringify(defaultCharacterAnimationData, null, 2)
  );
  const [characterBehaviorSource, setCharacterBehaviorData] = useState<string>(
    JSON.stringify(defaultCharacterBehaviorData, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | undefined>();
  const [characterVisualizer, setCharacterVisualizer] = useState<CharacterVisualizer>(new CharacterVisualizer())
  const [gameID, setGameID] = useState<string | undefined>();
  const [showSource, setShowSource] = useState(false);

  const onSubmit = () => {
    // Transform character animation data into a character locally
    // do an ugly cast
    try {
      const inputAnimationData = JSON.parse(characterAnimationSource) as AnimationFileData;
      setCharacterVisualizer(new CharacterVisualizer(inputAnimationData));
    } catch (error) {
      setJsonError((error as Error).message);
    }
    // Send backend character states to the server for it to re-make the character
    if (gameID) {
      sendBehaviorData(characterBehaviorSource, gameID);
    }
  }

  const handleChangeAnimationData = (animationData: string) => {
    setJsonError(undefined);
    setCharacterAnimationData(animationData);
  }

  const handleChangeBehaviorData = (behaviordata: string) => {
    setCharacterBehaviorData(behaviordata);
  }

  const handleToggleSource = () => {
    setShowSource(!showSource)
  }

  const getSafeParsedData = (source: string) => {
    try {
      return JSON.parse(characterAnimationSource)
    } catch (err) {
      return undefined
    }
  }

  const animationData = getSafeParsedData(characterAnimationSource)
  const behaviorData = getSafeParsedData(characterBehaviorSource)

  return (
    <div className="editor-page">
      <h1>Edit Character</h1>
      <div className="editor-page-interactions">
        <button onClick={handleToggleSource}>Show source</button>
        {showSource ? (
          <div className="editor-input-section">
            <div className="editor-text-section">
              <div>
                <p>Animation Config</p>
                <textarea
                  rows={15}
                  cols={50}
                  className="editor-text-input"
                  value={characterAnimationSource}
                  onChange={(event) => handleChangeAnimationData(event.target.value)}
                />
              </div>
              <div>
                <p>Behavior Config</p>
                <textarea
                  rows={15}
                  cols={50}
                  className="editor-text-input"
                  value={characterBehaviorSource}
                  onChange={(event) => handleChangeBehaviorData(event.target.value)}
                />
              </div>
              {jsonError ? (
                <p>{jsonError}</p>
              ) : null}
            </div>
            <Button onClick={onSubmit}>Submit</Button>
          </div>
        ) : null}
        {animationData && behaviorData ? (
          <EditorTester
            characterVisualizer={characterVisualizer}
            onChangeGameID={setGameID}
            characterAnimationData={JSON.parse(characterAnimationSource)}
            onChangeAnimationData={(animationData) => setCharacterAnimationData(JSON.stringify(animationData, null, 2))}
            characterBehaviorData={JSON.parse(characterBehaviorSource)}
            onChangeBehaviorData={(behaviorData) => setCharacterBehaviorData(JSON.stringify(behaviorData, null, 2))}
          />
        ) : null}
      </div>
    </div>
  )
}

export default EditorPage;