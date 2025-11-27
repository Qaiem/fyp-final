import clsx from "clsx";
import propTypes from "prop-types"

const Title = ({ title, className }) => {
  return (
    <h2
      className={clsx(
        "text-2xl font-semibold dark:text-white capitalize",
        className
      )}
    >
      {title}
    </h2>
  );
};

Title.propTypes = {
  title: propTypes.string.isRequired,
  className: propTypes.string,
};

export default Title;
