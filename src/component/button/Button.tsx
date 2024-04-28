import "./Button.css"

const BUTTON_CLASSES = {
    'primary': 'bfg-button',
    'secondary': 'bfg-button-secondary',
}

interface ButtonProps {
    onClick?: () => void,
    children: unknown,
    buttonStyle?: 'primary' | 'secondary'
}

export const Button = ({ onClick, children, buttonStyle='primary' }: ButtonProps) => {

    return (
        <button onClick={onClick} className={BUTTON_CLASSES[buttonStyle]}>{children}</button>
    )
}

export default Button;
