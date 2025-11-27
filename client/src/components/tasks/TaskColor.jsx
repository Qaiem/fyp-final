import clsx from "clsx";
import propTypes from "prop-types"

const TaskColor = ({ className }) => {
  return <div className={clsx("w-4 h-4 rounded-full", className)} />;
};

TaskColor.propTypes = {
  className: propTypes.string,
}

export default TaskColor;
