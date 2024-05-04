interface ParameterInputProps {
  label: string
  value: string
  onChange: (newValue: string) => void,
}

const ParameterStringInput = ({
  label,
  value,
  onChange,
}: ParameterInputProps) => {
  return (
    <div className="animation-parameter-input" key={label}>
      <p>{label}</p>
      <input
        value={value}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
    </div>
  )
}

export default ParameterStringInput
