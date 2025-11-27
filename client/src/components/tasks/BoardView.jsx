import TaskCard from "./TaskCard";
import propTypes from "prop-types";

const BoardView = ({ tasks }) => {
  return (
    <div className='w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10'>
      {tasks?.map((task, index) => (
        // <></>
        <TaskCard task={task} key={index}  />
      ))}
    </div>
  );
};

BoardView.propTypes = {
  tasks: propTypes.array.isRequired,
};

export default BoardView;
