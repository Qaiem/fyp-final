import { createContext, useContext, useState } from 'react';
import propTypes from 'prop-types'

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [taskStatus, setTaskStatus] = useState('');
  const [taskId, setTaskId] = useState(''); // Add taskId state
  // console.log(".",setTaskId)


  return (<>
    <TaskContext.Provider value={{ taskStatus, setTaskStatus, taskId, setTaskId }}>
      {children}
    </TaskContext.Provider>
  </>
   
  );
};

TaskProvider.propTypes = {
  children: propTypes.node.isRequired,
};

export const useTaskContext = () => useContext(TaskContext);
