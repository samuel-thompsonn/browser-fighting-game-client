interface ParameterInputProps {
  label: string
  value: number
  onChange: (newValue: number) => void
}

const ParameterInput = ({
  label,
  value,
  onChange
}: ParameterInputProps) => {
  return (
    <div className="animation-parameter-input" key={label}>
      <p>{label}</p>
      <input
        type="number"
        value={value}
        onChange={(event) => {
          onChange(parseInt(event.target.value))
        }}
      />
    </div>
  )
}

export default ParameterInput