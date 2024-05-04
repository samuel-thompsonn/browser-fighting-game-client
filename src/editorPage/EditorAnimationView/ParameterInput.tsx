interface ParameterInputProps {
  label: string
  value: number
  onChange: (newValue: number) => void,
  step?: number
}

const ParameterInput = ({
  label,
  value,
  onChange,
  step,
}: ParameterInputProps) => {
  return (
    <div className="animation-parameter-input" key={label}>
      <p>{label}</p>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(event) => {
          onChange(parseFloat(event.target.value))
        }}
      />
    </div>
  )
}

export default ParameterInput