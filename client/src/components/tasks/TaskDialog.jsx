// import { Menu, Transition } from "@headlessui/react";
// import clsx from "clsx";
// import { Fragment, useState, useEffect, useRef, forwardRef } from "react";
// import { AiTwotoneFolderOpen } from "react-icons/ai";
// import { BsThreeDots } from "react-icons/bs";
// import { HiDuplicate } from "react-icons/hi";
// import { MdAdd, MdOutlineEdit } from "react-icons/md";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import {
//   useChangeTaskStageMutation,
//   useDuplicateTaskMutation,
//   useTrashTastMutation,
// } from "../../redux/slices/api/taskApiSlice";
// import ConfirmatioDialog from "../ConfirmationDialog";
// import AddSubTask from "./AddSubTask";
// import AddTask from "./AddTask";
// import { useTaskContext } from "../contextapi/TaskContext";
// import { useScreenRecording } from "../contextapi/RecordingContext";
// import TaskColor from "./TaskColor";
// import { useSelector } from "react-redux";
// import PropTypes from "prop-types";

// const CustomTransition = ({ children }) => (
//   <Transition
//     as={Fragment}
//     enter="transition ease-out duration-100"
//     enterFrom="transform opacity-0 scale-95"
//     enterTo="transform opacity-100 scale-100"
//     leave="transition ease-in duration-75"
//     leaveFrom="transform opacity-100 scale-100"
//     leaveTo="transform opacity-0 scale-95"
//   >
//     {children}
//   </Transition>
// );

// CustomTransition.propTypes = {
//   children: PropTypes.node.isRequired,
// };
// const ChangeTaskActions = forwardRef(({ _id, stage }, ref) => {
//   const [changeStage] = useChangeTaskStageMutation();
//   const [openConfirmation, setOpenConfirmation] = useState(false);
//   const videoRef = useRef(null);
//   const { setTaskStatus, setTaskId } = useTaskContext();
//   const { startRecording, attachStreamToVideo } = useScreenRecording();
//   const hasStartedRecording = useRef(false);

//   useEffect(() => {
//     attachStreamToVideo(videoRef);
//   }, [attachStreamToVideo]);

//   const changeHandler = async (val) => {
//     try {
//       const data = { id: _id, stage: val };
//       const res = await changeStage(data).unwrap();
//       toast.success(res?.message);
//       setTaskId(data.id);

//       if (val === "in progress") {
//         // Start recording immediately when changing to In Progress
//         setTaskStatus("In Progress");
//         sessionStorage.setItem("screenTrackingActive", "true");
//         startRecording();
//       } else {
//         // Stop only when moving to "completed" or "todo"
//         sessionStorage.removeItem("screenTrackingActive");
//       }
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   // 🔁 Auto resume on refresh (only if stage is "in progress")
//   useEffect(() => {
//     if (stage === "in progress" && !hasStartedRecording.current) {
//       const tracking = sessionStorage.getItem("screenTrackingActive");

//       if (!tracking) {
//         const confirmStart = window.confirm(
//           "This task is already in progress. Would you like to start screen recording?"
//         );
//         if (confirmStart) {
//           startRecording();
//           sessionStorage.setItem("screenTrackingActive", "true");
//         }
//       } else {
//         startRecording(); // Resume if already active
//       }

//       hasStartedRecording.current = true;
//     }
//   }, [stage, startRecording]);

//   const items = [
//     {
//       label: "To-Do",
//       stage: "todo",
//       icon: <TaskColor className="bg-blue-600" />,
//       onClick: () => changeHandler("todo"),
//     },
//     {
//       label: "In Progress",
//       stage: "in progress",
//       icon: <TaskColor className="bg-yellow-600" />,
//       onClick: () => setOpenConfirmation(true),
//     },
//     {
//       label: "Completed",
//       stage: "completed",
//       icon: <TaskColor className="bg-green-600" />,
//       onClick: () => changeHandler("completed"),
//     },
//   ];

//   return (
//     <>
//       <Menu as="div" className="relative inline-block text-left">
//         <Menu.Button className="inline-flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
//           Change Task
//         </Menu.Button>
//         <CustomTransition>
//           <Menu.Items className="absolute p-4 left-0 mt-2 w-40 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
//             <div className="px-1 py-1 space-y-2">
//               {items.map((el) => (
//                 <Menu.Item key={el.label} disabled={stage === el.stage}>
//                   {({ active }) => (
//                     <button
//                       disabled={stage === el.stage}
//                       onClick={el.onClick}
//                       className={clsx(
//                         active ? "bg-gray-200 text-gray-900" : "text-gray-900",
//                         "group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-50"
//                       )}
//                     >
//                       {el.icon} {el.label}
//                     </button>
//                   )}
//                 </Menu.Item>
//               ))}
//             </div>
//           </Menu.Items>
//         </CustomTransition>
//       </Menu>

//       {/* Confirmation dialog */}
//       {openConfirmation && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg p-6 shadow-lg">
//             <h3 className="text-lg font-medium text-gray-900">
//               Move Task to In Progress
//             </h3>
//             <p className="mt-2 text-sm text-gray-600">
//               Are you sure you want to move this task to In Progress?
//             </p>
//             <div className="mt-4 flex justify-end gap-2">
//               <button
//                 onClick={() => setOpenConfirmation(false)}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   setOpenConfirmation(false);
//                   changeHandler("in progress");
//                 }}
//                 className="px-4 py-2 bg-yellow-600 text-white rounded-md"
//               >
//                 Move Task to In Progress
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <video ref={videoRef} autoPlay className="hidden" />
//     </>
//   );
// });

// ChangeTaskActions.displayName = "ChangeTaskActions";

// ChangeTaskActions.propTypes = {
//   _id: PropTypes.string.isRequired,
//   stage: PropTypes.string.isRequired,
// };
// export default function TaskDialog({ task }) {
//   const { user } = useSelector((state) => state.auth);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openSubTask, setOpenSubTask] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const navigate = useNavigate();

//   const [deleteTask] = useTrashTastMutation();
//   const [duplicateTask] = useDuplicateTaskMutation();

//   const deleteHandler = async () => {
//     try {
//       const res = await deleteTask({
//         id: task._id,
//         isTrashed: "trash",
//       }).unwrap();
//       toast.success(res?.message);
//       setTimeout(() => {
//         setOpenDialog(false);
//         window.location.reload();
//       }, 500);
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   const duplicateHandler = async () => {
//     try {
//       const res = await duplicateTask(task._id).unwrap();
//       toast.success(res?.message);
//       setTimeout(() => {
//         window.location.reload();
//       }, 500);
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   const menuItems = [
//     {
//       label: "Open Task",
//       icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" />,
//       onClick: () => navigate(`/task/${task._id}`),
//     },
//     {
//       label: "Edit",
//       icon: <MdOutlineEdit className="mr-2 h-5 w-5" />,
//       onClick: () => setOpenEdit(true),
//     },
//     {
//       label: "Add Sub-Task",
//       icon: <MdAdd className="mr-2 h-5 w-5" />,
//       onClick: () => setOpenSubTask(true),
//     },
//     {
//       label: "Duplicate",
//       icon: <HiDuplicate className="mr-2 h-5 w-5" />,
//       onClick: duplicateHandler,
//     },
//   ];

//   return (
//     <>
//       <Menu as="div" className="relative inline-block text-left">
//         <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
//           <BsThreeDots />
//         </Menu.Button>
//         <CustomTransition>
//           <Menu.Items className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
//             <div className="px-1 py-1 space-y-2">
//               {menuItems.map((el, index) => (
//                 <Menu.Item key={el.label}>
//                   {({ active }) => (
//                     <button
//                       disabled={index !== 0 && !user.isAdmin}
//                       onClick={el.onClick}
//                       className={clsx(
//                         active ? "bg-blue-500 text-white" : "text-gray-900",
//                         "group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-gray-400"
//                       )}
//                     >
//                       {el.icon} {el.label}
//                     </button>
//                   )}
//                 </Menu.Item>
//               ))}
//             </div>

//             {!user.isAdmin && (
//               <div className="px-1 py-1">
//                 <Menu.Item>
//                   <ChangeTaskActions _id={task._id} stage={task.stage} />
//                 </Menu.Item>
//               </div>
//             )}

//             <div className="px-1 py-1">
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     disabled={!user.isAdmin}
//                     onClick={() => setOpenDialog(true)}
//                     className={clsx(
//                       active ? "bg-red-100 text-red-900" : "text-red-900",
//                       "group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-gray-400"
//                     )}
//                   >
//                     <RiDeleteBin6Line className="mr-2 h-5 w-5 text-red-600" />{" "}
//                     Delete
//                   </button>
//                 )}
//               </Menu.Item>
//             </div>
//           </Menu.Items>
//         </CustomTransition>
//       </Menu>

//       <AddTask
//         open={openEdit}
//         setOpen={setOpenEdit}
//         task={task}
//         key={new Date().getTime()}
//       />
//       <AddSubTask open={openSubTask} setOpen={setOpenSubTask} id={task._id} />
//       <ConfirmatioDialog
//         open={openDialog}
//         setOpen={setOpenDialog}
//         onClick={deleteHandler}
//       />
//     </>
//   );
// }

// TaskDialog.propTypes = {
//   task: PropTypes.object.isRequired,
//   onScreenShareStart: PropTypes.func,
// };

import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment, useState, useEffect, useRef, forwardRef } from "react";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { HiDuplicate } from "react-icons/hi";
import { MdAdd, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  useChangeTaskStageMutation,
  useDuplicateTaskMutation,
  useTrashTastMutation,
} from "../../redux/slices/api/taskApiSlice";
import ConfirmatioDialog from "../ConfirmationDialog";
import AddSubTask from "./AddSubTask";
import AddTask from "./AddTask";
import { useTaskContext } from "../contextapi/TaskContext";
import { useScreenRecording } from "../contextapi/RecordingContext";
import TaskColor from "./TaskColor";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const CustomTransition = ({ children }) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    {children}
  </Transition>
);

CustomTransition.propTypes = {
  children: PropTypes.node.isRequired,
};

const ChangeTaskActions = forwardRef(({ _id, stage }, ref) => {
  const [changeStage] = useChangeTaskStageMutation();
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const videoRef = useRef(null);
  const { setTaskStatus, setTaskId } = useTaskContext();
  const { startRecording, attachStreamToVideo } = useScreenRecording();
  const hasStarted = useRef(false);

  useEffect(() => {
    attachStreamToVideo(videoRef);
  }, [attachStreamToVideo]);

  // ✅ 1. Change handler logic
  const changeHandler = async (val) => {
    try {
      const data = { id: _id, stage: val };
      const res = await changeStage(data).unwrap();
      toast.success(res?.message);
      setTaskId(data.id);

      if (val === "in progress") {
        setTaskStatus("In Progress");

        // store timestamp when changed to "in progress"
        localStorage.setItem("lastInProgressChange", Date.now().toString());

        // start screen recording immediately
        startRecording();
      } else {
        localStorage.removeItem("lastInProgressChange");
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // ✅ 2. Auto start when page refreshes
  useEffect(() => {
    if (stage === "in progress" && !hasStarted.current) {
      const lastChange = parseInt(localStorage.getItem("lastInProgressChange"), 10);
      const now = Date.now();

      // if it was changed recently (within 5 seconds)
      if (lastChange && now - lastChange <= 5000) {
        startRecording();
      } else if (!lastChange) {
        // If no timestamp but still in progress (means already in-progress on refresh)
        startRecording();
      }

      hasStarted.current = true;
    }
  }, [stage, startRecording]);

  const items = [
    { label: "To-Do", stage: "todo", icon: <TaskColor className="bg-blue-600" />, onClick: () => changeHandler("todo") },
    { label: "In Progress", stage: "in progress", icon: <TaskColor className="bg-yellow-600" />, onClick: () => setOpenConfirmation(true) },
    { label: "Completed", stage: "completed", icon: <TaskColor className="bg-green-600" />, onClick: () => changeHandler("completed") },
  ];

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          Change Task
        </Menu.Button>
        <CustomTransition>
          <Menu.Items className="absolute p-4 left-0 mt-2 w-40 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 space-y-2">
              {items.map((el) => (
                <Menu.Item key={el.label} disabled={stage === el.stage}>
                  {({ active }) => (
                    <button
                      disabled={stage === el.stage}
                      onClick={el.onClick}
                      className={clsx(
                        active ? "bg-gray-200 text-gray-900" : "text-gray-900",
                        "group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm disabled:opacity-50"
                      )}
                    >
                      {el.icon} {el.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </CustomTransition>
      </Menu>

      {/* Confirmation dialog */}
      {openConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900">
              Move Task to In Progress
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to move this task to In Progress?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpenConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setOpenConfirmation(false);
                  changeHandler("in progress");
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md"
              >
                Move Task to In Progress
              </button>
            </div>
          </div>
        </div>
      )}

      <video ref={videoRef} autoPlay className="hidden" />
    </>
  );
});

ChangeTaskActions.displayName = "ChangeTaskActions";

ChangeTaskActions.propTypes = {
  _id: PropTypes.string.isRequired,
  stage: PropTypes.string.isRequired,
};

export default function TaskDialog({ task }) {
  const { user } = useSelector((state) => state.auth);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSubTask, setOpenSubTask] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [deleteTask] = useTrashTastMutation();
  const [duplicateTask] = useDuplicateTaskMutation();

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({ id: task._id, isTrashed: "trash" }).unwrap();
      toast.success(res?.message);
      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const duplicateHandler = async () => {
    try {
      const res = await duplicateTask(task._id).unwrap();
      toast.success(res?.message);
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const menuItems = [
    { label: "Open Task", icon: <AiTwotoneFolderOpen className="mr-2 h-5 w-5" />, onClick: () => navigate(`/task/${task._id}`) },
    { label: "Edit", icon: <MdOutlineEdit className="mr-2 h-5 w-5" />, onClick: () => setOpenEdit(true) },
    { label: "Add Sub-Task", icon: <MdAdd className="mr-2 h-5 w-5" />, onClick: () => setOpenSubTask(true) },
    { label: "Duplicate", icon: <HiDuplicate className="mr-2 h-5 w-5" />, onClick: duplicateHandler },
  ];

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          <BsThreeDots />
        </Menu.Button>
        <CustomTransition>
          <Menu.Items className="absolute p-4 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
            <div className="px-1 py-1 space-y-2">
              {menuItems.map((el, index) => (
                <Menu.Item key={el.label}>
                  {({ active }) => (
                    <button
                      disabled={index !== 0 && !user.isAdmin}
                      onClick={el.onClick}
                      className={clsx(
                        active ? "bg-blue-500 text-white" : "text-gray-900",
                        "group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-gray-400"
                      )}
                    >
                      {el.icon} {el.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>

            {!user.isAdmin && (
              <div className="px-1 py-1">
                <Menu.Item>
                  <ChangeTaskActions _id={task._id} stage={task.stage} />
                </Menu.Item>
              </div>
            )}

            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    disabled={!user.isAdmin}
                    onClick={() => setOpenDialog(true)}
                    className={clsx(
                      active ? "bg-red-100 text-red-900" : "text-red-900",
                      "group flex w-full items-center rounded-md px-2 py-2 text-sm disabled:text-gray-400"
                    )}
                  >
                    <RiDeleteBin6Line className="mr-2 h-5 w-5 text-red-600" />
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </CustomTransition>
      </Menu>

      <AddTask open={openEdit} setOpen={setOpenEdit} task={task} key={new Date().getTime()} />
      <AddSubTask open={openSubTask} setOpen={setOpenSubTask} id={task._id} />
      <ConfirmatioDialog open={openDialog} setOpen={setOpenDialog} onClick={deleteHandler} />
    </>
  );
}

TaskDialog.propTypes = {
  task: PropTypes.object.isRequired,
};
