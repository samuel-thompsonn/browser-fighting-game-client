import { ChangeEvent } from 'react';
import './StatsBox.css';

export interface CharacterStats {
  movementSpeed: number;
  maxHealth: number;
  knockbackStrength: number;
}

interface StatsProps {
  stats: CharacterStats;
  onChangeStats: (newValue: CharacterStats) => void;
};

interface StatEditorProps {
  name: string;
  value: number;
  onChange: (newValue: number) => void;
};

function StatEditor(props: StatEditorProps) {
  return (
    <div className="Stat-Entry">
      <p>{props.name}</p>
      <input
        type="number"
        value={props.value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => props.onChange(parseInt(event.target.value))}
      />
    </div>
  )
};

function StatsBox(props: StatsProps) {
  return (
    <div className="Stats-Box">
      <h2>Stats</h2>
      <div className="Stat-List">
        <StatEditor
          name="Movement Speed"
          value={props.stats.movementSpeed}
          onChange={(newValue: number) => props.onChangeStats({...props.stats, movementSpeed: newValue})}
        />
        <StatEditor
          name={"Maximum Health"}
          value={props.stats.maxHealth}
          onChange={(newValue: number) => props.onChangeStats({...props.stats, maxHealth: newValue})}
        />
        <StatEditor
          name={"Knockback Strength"}
          value={props.stats.knockbackStrength}
          onChange={(newValue: number) => props.onChangeStats({...props.stats, knockbackStrength: newValue})}
        />
      </div>
    </div>
  )
}

export default StatsBox;