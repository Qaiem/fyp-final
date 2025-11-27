import clsx from "clsx";
import propTypes from "prop-types"

const Button = ({ className, label, type, onClick = () => {}, icon }) => {
  return (
    <button
      type={type || "button"}
      className={clsx("px-3 py-2 outline-none rounded", className)}
      onClick={onClick}
    >
      <span>{label}</span>

      {icon && icon}
    </button>
  );
};

Button.propTypes = {
  className: propTypes.string.isRequired,
  label: propTypes.string.isRequired,
  type: propTypes.string,
  onClick: propTypes.func,
  icon: propTypes.node,
};

export default Button;

