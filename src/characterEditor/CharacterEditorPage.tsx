import { useEffect, useState } from 'react';
import Interaction from './Interaction';
import InteractionsEditor from './InteractionsEditor';
import StatsBox, { CharacterStats } from './StatsBox';
import sampleCharacterData from './characterASimple.json';

interface CharacterData {
  name: string;
  stats: {
    movementSpeed: number;
    maxHealth: number;
    knockbackStrength: number;
  }
  interactions: Interaction[];
};

function EditorPage() {

  const [characterData, setCharacterData] = useState<CharacterData>();

  useEffect(() => {
    fetch("https://browser-fighting-game.s3.us-west-1.amazonaws.com/character-files/sample-character/characterASimple.json")
    .then((jsonData) => {
      jsonData.json().then((characterData: CharacterData) => {
        console.log(characterData);
        setCharacterData(characterData);
      });
    })
    .catch((reason) => {
      console.log(reason);
      console.log("Failed to load character data!");
      setCharacterData(sampleCharacterData);
    });
  }, []);

  function downloadCharacterFile() {
    const blob = new Blob([JSON.stringify(characterData, undefined, 2)], { type: "application/json" });
    const dummyLink = document.createElement('a');
    dummyLink.download = "CharacterFile.json";
    dummyLink.href = URL.createObjectURL(blob);
    dummyLink.click();
  }
  

  function characterEditorInterface(characterData: CharacterData) {

    function handleInteractionChange(newValue: Interaction, index: number) {
      characterData.interactions[index] = newValue;
      setCharacterData({...characterData});
    }

    return (
      <div className="Character-Editor">
        <div className="Title-Box">
          <h1>{characterData? characterData.name : "Unknown"}</h1>
          <button onClick={downloadCharacterFile}>Download</button>
        </div>
        <StatsBox stats={characterData.stats} onChangeStats={(newValue: CharacterStats) => {
          characterData.stats = newValue;
          setCharacterData({...characterData});
        }}/>
        <div className="Interactions-Box">
          <InteractionsEditor
            interactions={characterData.interactions}
            onChange={handleInteractionChange}
          />
        </div>
        <div className="States-Box">
          <h2>States</h2>
          <div className="States-List">
            <select name="states">
              <option value="idleLeft">IdleLeft</option>
              <option value="walkLeft">WalkLeft</option>
            </select>
            <div className="State-Interface">
              <div className="State-General-Interface">
                <h3>General</h3>
                <p>Name:</p>
                <input type="text" value="Idle Facing Left"></input>
                <p>State ID:</p>
                <input type="text" value="idleLeft"></input>
                <p>Number of frames:</p>
                <input type="text" value="14"></input>
              </div>
              <div className="State-Collisions-Interface">
                <h3>Collisions</h3>
                <div className="State-Collisions-List">
                  <select id="collisionEntity" value="Body hurtbox">
                    <option value="Body hurtbox">Body hurtbox</option>
                  </select>
                  <p>Name: </p>
                  <input type="text" value="Punch hitbox"/>
                  <p>Type: </p>
                  <select id="collisionEntityType" value="hitbox">
                    <option value="hurtbox">Hurtbox</option>
                    <option value="hitbox">Hitbox</option>
                  </select>
                  <p>Damage: </p>
                  <input type="number" value="0"/>
                  <p>Knockback: </p>
                  <input type="number" value="0"/>
                  <p>x: </p>
                  <input type="number" value="0"/>
                  <p>y: </p>
                  <input type="number" value="0"/>
                  <p>width: </p>
                  <input type="number" value="1.0"/>
                  <p>height: </p>
                  <input type="number" value="1.0"/>
                </div>
              </div>
              <div className="State-Effect-List">
                <h3>Effects</h3>
                <select id="stateEffectSelection">
                  <option value="move">Move Right</option>
                </select>
                <div className="State-Effect-Interface">
                  <p>Name: </p>
                  <input type="text" value="Move Right"/>
                  <p>Type: </p>
                  <select id="Help" value="move">
                    <option value="move">Move</option>
                  </select>
                  <p>x: </p>
                  <input type="number" value="10.0"/>
                  <p>y: </p>
                  <input type="number" value="0"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function characterEditorLoadingScreen() {
    return <p>Loading character...</p>
  }

  return characterData? characterEditorInterface(characterData) : characterEditorLoadingScreen();

}

export default EditorPage;