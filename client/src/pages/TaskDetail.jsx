// import clsx from "clsx";
// import moment from "moment";
// import { useState, useEffect, useRef } from "react";
// import { FaBug, FaSpinner, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
// import { GrInProgress } from "react-icons/gr";
// import ImagesModal from "../components/ImagesModal";
// import {
//   MdKeyboardArrowDown,
//   MdKeyboardArrowUp,
//   MdKeyboardDoubleArrowUp,
//   MdOutlineDoneAll,
//   MdOutlineMessage,
//   MdTaskAlt,
// } from "react-icons/md";
// import { RxActivityLog } from "react-icons/rx";
// import { useParams } from "react-router-dom";
// import { toast } from "sonner";
// import { Button, Loading, Tabs } from "../components";
// import { TaskColor } from "../components/tasks";
// import {
//   useChangeSubTaskStatusMutation,
//   useGetSingleTaskQuery,
//   usePostTaskActivityMutation,
//   useUploadImageMutation,
// } from "../redux/slices/api/taskApiSlice";
// import {
//   PRIOTITYSTYELS,
//   TASK_TYPE,
//   getCompletedSubTasks,
//   getInitials,
// } from "../utils";
// import { useSelector } from "react-redux";
// import PropTypes from "prop-types";
// import { useScreenRecording } from "../components/contextapi/RecordingContext";

// const ICONS = {
//   high: <MdKeyboardDoubleArrowUp />,
//   medium: <MdKeyboardArrowUp />,
//   low: <MdKeyboardArrowDown />,
// };

// const bgColor = {
//   high: "bg-red-200",
//   medium: "bg-yellow-200",
//   low: "bg-blue-200",
// };

// const TABS = [
//   { title: "Task Detail", icon: <FaTasks /> },
//   { title: "Activities/Timeline", icon: <RxActivityLog /> },
// ];

// const TASKTYPEICON = {
//   commented: (
//     <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
//       <MdOutlineMessage />
//     </div>
//   ),
//   started: (
//     <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
//       <FaThumbsUp size={20} />
//     </div>
//   ),
//   assigned: (
//     <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
//       <FaUser size={14} />
//     </div>
//   ),
//   bug: (
//     <div className="text-red-600">
//       <FaBug size={24} />
//     </div>
//   ),
//   completed: (
//     <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
//       <MdOutlineDoneAll size={24} />
//     </div>
//   ),
//   "in progress": (
//     <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
//       <GrInProgress size={16} />
//     </div>
//   ),
// };

// const act_types = [
//   "Started",
//   "Completed",
//   "In Progress",
//   "Commented",
//   "Bug",
//   "Assigned",
// ];

// const Card = ({ item }) => (
//   <div className={`flex space-x-4`}>
//     <div className="flex flex-col items-center flex-shrink-0">
//       <div className="w-10 h-10 flex items-center justify-center">
//         {TASKTYPEICON[item?.type]}
//       </div>
//       <div className="h-full flex items-center">
//         <div className="w-0.5 bg-gray-300 h-full"></div>
//       </div>
//     </div>
//     <div className="flex flex-col gap-y-1 mb-8">
//       <p className="font-semibold">{item?.by?.name}</p>
//       <div className="text-gray-500 space-x-2">
//         <span className="capitalize">{item?.type}</span>
//         <span className="text-sm">{moment(item?.date).fromNow()}</span>
//       </div>
//       <div className="text-gray-700">{item?.activity}</div>
//     </div>
//   </div>
// );

// Card.propTypes = {
//   item: PropTypes.object.isRequired,
// };

// const Activities = ({ activity, id, refetch }) => {
//   const [selected, setSelected] = useState("Started");
//   const [text, setText] = useState("");
//   const [postActivity, { isLoading }] = usePostTaskActivityMutation();

//   const handleSubmit = async () => {
//     try {
//       const data = { type: selected.toLowerCase(), activity: text };
//       const res = await postActivity({ data, id }).unwrap();
//       setText("");
//       toast.success(res?.message);
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   return (
//     <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto">
//       <div className="w-full md:w-1/2">
//         <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>
//         <div className="w-full space-y-0">
//           {activity?.map((item) => (
//             <Card key={item.id} item={item} />
//           ))}
//         </div>
//       </div>
//       <div className="w-full md:w-1/3">
//         <h4 className="text-gray-600 font-semibold text-lg mb-5">
//           Add Activity
//         </h4>
//         <div className="w-full flex flex-wrap gap-5">
//           {act_types.map((item) => (
//             <div key={item} className="flex gap-2 items-center">
//               <input
//                 type="checkbox"
//                 className="w-4 h-4"
//                 checked={selected === item}
//                 onChange={() => setSelected(item)}
//               />
//               <p>{item}</p>
//             </div>
//           ))}
//           <textarea
//             rows={10}
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Type ......"
//             className="bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500"
//           />
//           {isLoading ? (
//             <Loading />
//           ) : (
//             <Button
//               type="button"
//               label="Submit"
//               onClick={handleSubmit}
//               className="bg-blue-600 text-white rounded"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// Activities.propTypes = {
//   activity: PropTypes.array.isRequired,
//   id: PropTypes.string.isRequired,
//   refetch: PropTypes.func.isRequired,
// };

// // ---------------- TASK DETAIL COMPONENT ----------------
// const TaskDetail = () => {
//   const { id } = useParams();
//   const [images, setImages] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selected, setSelected] = useState(0);
//   const { user } = useSelector((state) => state.auth);

//   const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
//   const [uploadImage] = useUploadImageMutation();
//   const [subTaskAction, { isLoading: isSubmitting }] =
//     useChangeSubTaskStatusMutation();

//   const { startRecording, stopRecording } = useScreenRecording();
//   const videoRef = useRef(null);
//   const task = data?.task || {};

//   // Helper — Attach stream to hidden video element
//   const attachStream = (stream) => {
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//       videoRef.current.onloadedmetadata = () => videoRef.current.play();
//     }
//   };

//   // Take and upload screenshots every 5s
//   const startTakingScreenshots = (stream, taskId) => {
//     const interval = setInterval(async () => {
//       const video = videoRef.current;
//       if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
//         const canvas = document.createElement("canvas");
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//         canvas.toBlob(async (blob) => {
//           if (!blob) return;
//           const arrayBuffer = await blob.arrayBuffer();
//           const uint8Array = new Uint8Array(arrayBuffer);
//           try {
//             await uploadImage({ taskId, uint8Array }).unwrap();
//             console.log("📸 Screenshot uploaded for task:", taskId);
//           } catch (err) {
//             console.error("❌ Upload failed:", err);
//           }
//         }, "image/png");
//       }
//     }, 5000);

//     stream.getVideoTracks()[0].onended = () => {
//       clearInterval(interval);
//       sessionStorage.removeItem("screenTrackingActive");
//       stopRecording();
//     };
//   };

//   // Screen recording logic based on task stage
//   useEffect(() => {
//     if (!task?._id || user?.isAdmin) return;

//     const lastStatus = sessionStorage.getItem("lastTaskStage");
//     const currentStatus = task.stage;

//     if (currentStatus === "in progress") {
//       const changedToInProgressRecently = lastStatus === "todo";

//       if (
//         changedToInProgressRecently ||
//         !sessionStorage.getItem("screenTrackingActive")
//       ) {
//         (async () => {
//           try {
//             const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//             attachStream(stream);
//             startRecording();
//             startTakingScreenshots(stream, task._id);
//             sessionStorage.setItem("screenTrackingActive", "true");
//           } catch (err) {
//             console.error("Error starting screen share:", err);
//           }
//         })();
//       }
//     } else {
//       stopRecording();
//       sessionStorage.removeItem("screenTrackingActive");
//     }

//     sessionStorage.setItem("lastTaskStage", currentStatus);
//   }, [task.stage, task._id]);

//   // --- Buffer to Base64 conversion ---
//   const convertBufferToBase64 = (screenshot) => {
//     const buffer = screenshot?.data;
//     if (buffer && buffer.type === "Buffer" && Array.isArray(buffer.data)) {
//       try {
//         const uint8Array = new Uint8Array(buffer.data);
//         let binary = "";
//         const chunkSize = 1024;
//         for (let i = 0; i < uint8Array.length; i += chunkSize) {
//           const chunk = uint8Array.subarray(i, i + chunkSize);
//           binary += String.fromCharCode(...chunk);
//         }
//         return `data:image/png;base64,${btoa(binary)}`;
//       } catch (e) {
//         console.error("Conversion error:", e);
//         return null;
//       }
//     }
//     return null;
//   };

//   useEffect(() => {
//     if (data?.task?.screenshots?.length > 0) {
//       const convertedImages = data.task.screenshots
//         .map((s) => convertBufferToBase64(s))
//         .filter((i) => i);
//       setImages(convertedImages);
//     }
//   }, [data]);

//   const handleButtonClick = () => {
//     if (images.length > 0) setModalOpen(true);
//   };

//   const handleSubmitAction = async ({ status, id, subId }) => {
//     try {
//       const res = await subTaskAction({ id, subId, status: !status }).unwrap();
//       toast.success(res?.message);
//       refetch();
//     } catch (err) {
//       toast.error(err?.data?.message || err.error);
//     }
//   };

//   if (isLoading)
//     return (
//       <div className="py-10">
//         <Loading />
//       </div>
//     );

//   const percentageCompleted =
//     task?.subTasks?.length === 0
//       ? 0
//       : (getCompletedSubTasks(task?.subTasks) / task?.subTasks?.length) * 100;

//   return (
//     <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
//       <h1 className="text-2xl text-gray-600 font-bold">{task?.title}</h1>
//       <Tabs tabs={TABS} setSelected={setSelected}>
//         {selected === 0 ? (
//           <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow rounded-md px-8 py-8 overflow-y-auto">
//             {/* LEFT SIDE */}
//             <div className="w-full md:w-1/2 space-y-8">
//               <div className="flex items-center gap-5">
//                 <div
//                   className={clsx(
//                     "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
//                     PRIOTITYSTYELS[task?.priority],
//                     bgColor[task?.priority]
//                   )}
//                 >
//                   <span className="text-lg">{ICONS[task?.priority]}</span>
//                   <span className="uppercase">{task?.priority} Priority</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <TaskColor className={TASK_TYPE[task?.stage]} />
//                   <span className="text-black uppercase">{task?.stage}</span>
//                 </div>
//               </div>

//               <p className="text-gray-500">
//                 Created At: {new Date(task?.date).toDateString()}
//               </p>

//               <div className="flex items-center gap-8 p-4 border-y border-gray-200">
//                 <div className="space-x-2">
//                   <span className="font-semibold">Assets :</span>
//                   <span>{task?.assets?.length}</span>
//                 </div>
//                 <span className="text-gray-400">|</span>
//                 <div className="space-x-2">
//                   <span className="font-semibold">Sub-Task :</span>
//                   <span>{task?.subTasks?.length}</span>
//                 </div>
//               </div>

//               {user?.isAdmin && (
//                 <Button
//                   label="Track Task"
//                   className="flex gap-1 items-center bg-purple-600 text-white rounded-md py-2 2xl:py-2.5"
//                   onClick={handleButtonClick}
//                 />
//               )}
//               <ImagesModal
//                 open={isModalOpen}
//                 onClose={() => setModalOpen(false)}
//                 images={images}
//               />

//               {/* TASK TEAM */}
//               <div className="space-y-4 py-6">
//                 <p className="text-gray-500 font-semibold text-sm">TASK TEAM</p>
//                 {task?.team?.map((m, index) => (
//                   <div
//                     key={index + m?._id}
//                     className="flex gap-4 py-2 items-center border-t border-gray-200"
//                   >
//                     <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600">
//                       {getInitials(m?.name)}
//                     </div>
//                     <div>
//                       <p className="text-lg font-semibold">{m?.name}</p>
//                       <span className="text-gray-500">{m?.title}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* SUB-TASKS */}
//               {task?.subTasks?.length > 0 && (
//                 <div className="space-y-4 py-6">
//                   <div className="flex items-center gap-5">
//                     <p className="text-gray-500 font-semibold text-sm">
//                       SUB-TASKS
//                     </p>
//                     <div
//                       className={`w-fit h-8 px-2 rounded-full flex items-center justify-center text-white ${
//                         percentageCompleted < 50
//                           ? "bg-rose-600"
//                           : percentageCompleted < 80
//                           ? "bg-amber-600"
//                           : "bg-emerald-600"
//                       }`}
//                     >
//                       {percentageCompleted.toFixed(2)}%
//                     </div>
//                   </div>
//                   <div className="space-y-8">
//                     {task.subTasks.map((el) => (
//                       <div key={el?._id} className="flex gap-3">
//                         <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-200">
//                           <MdTaskAlt className="text-violet-600" size={26} />
//                         </div>
//                         <div className="space-y-1">
//                           <div className="flex gap-2 items-center">
//                             <span className="text-sm text-gray-500">
//                               {new Date(el?.date).toDateString()}
//                             </span>
//                             <span className="px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold lowercase">
//                               {el?.tag}
//                             </span>
//                             <span
//                               className={`px-2 py-0.5 text-center text-sm rounded-full font-semibold ${
//                                 el?.isCompleted
//                                   ? "bg-emerald-100 text-emerald-700"
//                                   : "bg-amber-50 text-amber-600"
//                               }`}
//                             >
//                               {el?.isCompleted ? "done" : "in progress"}
//                             </span>
//                           </div>
//                           <p className="text-gray-700 pb-2">{el?.title}</p>
//                           <button
//                             disabled={isSubmitting}
//                             className={`text-sm outline-none bg-gray-100 text-gray-800 p-1 rounded ${
//                               el?.isCompleted
//                                 ? "hover:bg-rose-100 hover:text-rose-800"
//                                 : "hover:bg-emerald-100 hover:text-emerald-800"
//                             } disabled:cursor-not-allowed`}
//                             onClick={() =>
//                               handleSubmitAction({
//                                 status: el?.isCompleted,
//                                 id: task?._id,
//                                 subId: el?._id,
//                               })
//                             }
//                           >
//                             {isSubmitting ? (
//                               <FaSpinner className="animate-spin" />
//                             ) : el?.isCompleted ? (
//                               "Mark as Undone"
//                             ) : (
//                               "Mark as Done"
//                             )}
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="w-full md:w-1/2 space-y-3">
//               {task?.description && (
//                 <div className="mb-10">
//                   <p className="text-lg font-semibold">TASK DESCRIPTION</p>
//                   <div>{task?.description}</div>
//                 </div>
//               )}

//               {task?.assets?.length > 0 && (
//                 <div className="pb-10">
//                   <p className="text-lg font-semibold">ASSETS</p>
//                   <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {task.assets.map((el, index) => (
//                       <img
//                         key={index}
//                         src={el}
//                         alt={`asset-${index}`}
//                         className="w-full rounded h-auto md:h-44 2xl:h-52 cursor-pointer transition-all duration-700 md:hover:scale-125 hover:z-50"
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {task?.links?.length > 0 && (
//                 <div>
//                   <p className="text-lg font-semibold">SUPPORT LINKS</p>
//                   <div className="w-full flex flex-col gap-4">
//                     {task.links.map((el, index) => (
//                       <a
//                         key={index}
//                         href={el}
//                         target="blank"
//                         className="text-blue-600 hover:underline"
//                       >
//                         {el}
//                       </a>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <Activities activity={task?.activities} refetch={refetch} id={id} />
//         )}
//       </Tabs>
//     </div>
//   );
// };

// export default TaskDetail;

import clsx from "clsx";
import moment from "moment";
import { useState, useEffect, useRef } from "react";
import { FaBug, FaSpinner, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import ImagesModal from "../components/ImagesModal";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Tabs } from "../components";
import { TaskColor } from "../components/tasks";
import {
  useChangeSubTaskStatusMutation,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
  useUploadImageMutation,
} from "../redux/slices/api/taskApiSlice";
import {
  PRIOTITYSTYELS,
  TASK_TYPE,
  getCompletedSubTasks,
  getInitials,
} from "../utils";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useScreenRecording } from "../components/contextapi/RecordingContext";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const Card = ({ item }) => (
  <div className="flex space-x-4">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-10 h-10 flex items-center justify-center">
        {TASKTYPEICON[item?.type]}
      </div>
      <div className="h-full flex items-center">
        <div className="w-0.5 bg-gray-300 h-full"></div>
      </div>
    </div>
    <div className="flex flex-col gap-y-1 mb-8">
      <p className="font-semibold">{item?.by?.name}</p>
      <div className="text-gray-500 space-x-2">
        <span className="capitalize">{item?.type}</span>
        <span className="text-sm">{moment(item?.date).fromNow()}</span>
      </div>
      <div className="text-gray-700">{item?.activity}</div>
    </div>
  </div>
);

Card.propTypes = {
  item: PropTypes.object.isRequired,
};

const Activities = ({ activity, id, refetch }) => {
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");
  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    try {
      const data = { type: selected.toLowerCase(), activity: text };
      const res = await postActivity({ data, id }).unwrap();
      setText("");
      toast.success(res?.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto">
      <div className="w-full md:w-1/2">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>
        <div className="w-full space-y-0">
          {activity?.map((item) => (
            <Card key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">
          Add Activity
        </h4>
        <div className="w-full flex flex-wrap gap-5">
          {act_types.map((item) => (
            <div key={item} className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selected === item}
                onChange={() => setSelected(item)}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type ......"
            className="bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500"
          />
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type="button"
              label="Submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};

Activities.propTypes = {
  activity: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
  refetch: PropTypes.func.isRequired,
};

// ---------------- TASK DETAIL COMPONENT ----------------
const TaskDetail = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);
  const [uploadImage] = useUploadImageMutation();
  const [subTaskAction, { isLoading: isSubmitting }] =
    useChangeSubTaskStatusMutation();

  const { startRecording, stopRecording } = useScreenRecording();
  const videoRef = useRef(null);
  const task = data?.task || {};

  // Attach stream to hidden video element
  const attachStream = (stream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current.play();
    }
  };

  // Take and upload screenshots every 5s
  const startTakingScreenshots = (stream, taskId) => {
    const interval = setInterval(async () => {
      const video = videoRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const arrayBuffer = await blob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          try {
            await uploadImage({ taskId, uint8Array }).unwrap();
            console.log("📸 Screenshot uploaded for task:", taskId);
          } catch (err) {
            console.error("❌ Upload failed:", err);
          }
        }, "image/png");
      }
    }, 5000);

    stream.getVideoTracks()[0].onended = () => {
      clearInterval(interval);
      sessionStorage.removeItem("screenTrackingActive");
      stopRecording();
    };
  };

  // Screen recording logic based on task stage
  useEffect(() => {
    if (!task?._id || user?.isAdmin) return;

    const lastStatus = sessionStorage.getItem("lastTaskStage");
    const lastChangeTime = Number(sessionStorage.getItem("lastChangeTime")) || 0;
    const currentStatus = task.stage;
    const now = Date.now();

    // Detect recent change (within 5 seconds)
    const changedToInProgressRecently =
      lastStatus === "todo" &&
      currentStatus === "in progress" &&
      now - lastChangeTime <= 5000;

    // Start screen share if newly changed or already in progress
    if (
      currentStatus === "in progress" &&
      (changedToInProgressRecently ||
        !sessionStorage.getItem("screenTrackingActive"))
    ) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });
          attachStream(stream);
          startRecording();
          startTakingScreenshots(stream, task._id);
          sessionStorage.setItem("screenTrackingActive", "true");
        } catch (err) {
          console.error("Error starting screen share:", err);
        }
      })();
    }

    // Stop when leaving in-progress state
    if (currentStatus !== "in progress") {
      stopRecording();
      sessionStorage.removeItem("screenTrackingActive");
    }

    // Save last status + change timestamp
    if (lastStatus !== currentStatus) {
      sessionStorage.setItem("lastChangeTime", now.toString());
      sessionStorage.setItem("lastTaskStage", currentStatus);
    }
  }, [task.stage, task._id]);

  // --- Convert screenshot buffer to base64 ---
 const convertBufferToBase64 = (screenshot) => {
    const buffer = screenshot?.data;
    if (buffer && buffer.type === "Buffer" && Array.isArray(buffer.data)) {
      try {
        const uint8Array = new Uint8Array(buffer.data);
        let binary = "";
        const chunkSize = 1024;
        for (let i = 0; i < uint8Array.length; i += chunkSize) {
          const chunk = uint8Array.subarray(i, i + chunkSize);
          binary += String.fromCharCode(...chunk);
        }
        return `data:image/png;base64,${btoa(binary)}`;
      } catch {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    if (data?.task?.screenshots?.length > 0) {
      const converted = data.task.screenshots
        .map((s) => convertBufferToBase64(s))
        .filter(Boolean);
      setImages(converted);
    }
  }, [data]);

  const handleButtonClick = () => {
    if (images.length > 0) setModalOpen(true);
  };

  const handleSubmitAction = async ({ status, id, subId }) => {
    try {
      const res = await subTaskAction({ id, subId, status: !status }).unwrap();
      toast.success(res?.message);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading)
    return (
      <div className="py-10">
        <Loading />
      </div>
    );

  const percentageCompleted =
    task?.subTasks?.length === 0
      ? 0
      : (getCompletedSubTasks(task?.subTasks) / task?.subTasks?.length) * 100;

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <h1 className="text-2xl text-gray-600 font-bold">{task?.title}</h1>
      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow rounded-md px-8 py-8 overflow-y-auto">
            {/* LEFT SIDE */}
            <div className="w-full md:w-1/2 space-y-8">
              <div className="flex items-center gap-5">
                <div
                  className={clsx(
                    "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                    PRIOTITYSTYELS[task?.priority],
                    bgColor[task?.priority]
                  )}
                >
                  <span className="text-lg">{ICONS[task?.priority]}</span>
                  <span className="uppercase">{task?.priority} Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <TaskColor className={TASK_TYPE[task?.stage]} />
                  <span className="text-black uppercase">{task?.stage}</span>
                </div>
              </div>

              <p className="text-gray-500">
                Created At: {new Date(task?.date).toDateString()}
              </p>

              <div className="flex items-center gap-8 p-4 border-y border-gray-200">
                <div className="space-x-2">
                  <span className="font-semibold">Assets :</span>
                  <span>{task?.assets?.length}</span>
                </div>
                <span className="text-gray-400">|</span>
                <div className="space-x-2">
                  <span className="font-semibold">Sub-Task :</span>
                  <span>{task?.subTasks?.length}</span>
                </div>
              </div>

              {user?.isAdmin && (
                <Button
                  label="Track Task"
                  className="flex gap-1 items-center bg-purple-600 text-white rounded-md py-2 2xl:py-2.5"
                  onClick={handleButtonClick}
                />
              )}
              <ImagesModal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                images={images}
              />

              {/* TEAM */}
              <div className="space-y-4 py-6">
                <p className="text-gray-500 font-semibold text-sm">TASK TEAM</p>
                {task?.team?.map((m, i) => (
                  <div
                    key={i + m?._id}
                    className="flex gap-4 py-2 items-center border-t border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600">
                      {getInitials(m?.name)}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{m?.name}</p>
                      <span className="text-gray-500">{m?.title}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUB-TASKS */}
              {task?.subTasks?.length > 0 && (
                <div className="space-y-4 py-6">
                  <div className="flex items-center gap-5">
                    <p className="text-gray-500 font-semibold text-sm">
                      SUB-TASKS
                    </p>
                    <div
                      className={`w-fit h-8 px-2 rounded-full flex items-center justify-center text-white ${
                        percentageCompleted < 50
                          ? "bg-rose-600"
                          : percentageCompleted < 80
                          ? "bg-amber-600"
                          : "bg-emerald-600"
                      }`}
                    >
                      {percentageCompleted.toFixed(2)}%
                    </div>
                  </div>
                  <div className="space-y-8">
                    {task.subTasks.map((el) => (
                      <div key={el?._id} className="flex gap-3">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-violet-200">
                          <MdTaskAlt className="text-violet-600" size={26} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-500">
                              {new Date(el?.date).toDateString()}
                            </span>
                            <span className="px-2 py-0.5 text-center text-sm rounded-full bg-violet-100 text-violet-700 font-semibold lowercase">
                              {el?.tag}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-center text-sm rounded-full font-semibold ${
                                el?.isCompleted
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {el?.isCompleted ? "done" : "in progress"}
                            </span>
                          </div>
                          <p className="text-gray-700 pb-2">{el?.title}</p>
                          <button
                            disabled={isSubmitting}
                            className={`text-sm outline-none bg-gray-100 text-gray-800 p-1 rounded ${
                              el?.isCompleted
                                ? "hover:bg-rose-100 hover:text-rose-800"
                                : "hover:bg-emerald-100 hover:text-emerald-800"
                            } disabled:cursor-not-allowed`}
                            onClick={() =>
                              handleSubmitAction({
                                status: el?.isCompleted,
                                id: task?._id,
                                subId: el?._id,
                              })
                            }
                          >
                            {isSubmitting ? (
                              <FaSpinner className="animate-spin" />
                            ) : el?.isCompleted ? (
                              "Mark as Undone"
                            ) : (
                              "Mark as Done"
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full md:w-1/2 space-y-3">
              {task?.description && (
                <div className="mb-10">
                  <p className="text-lg font-semibold">TASK DESCRIPTION</p>
                  <div>{task?.description}</div>
                </div>
              )}

              {task?.assets?.length > 0 && (
                <div className="pb-10">
                  <p className="text-lg font-semibold">ASSETS</p>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    {task.assets.map((el, index) => (
                      <img
                        key={index}
                        src={el}
                        alt={`asset-${index}`}
                        className="w-full rounded h-auto md:h-44 2xl:h-52 cursor-pointer transition-all duration-700 md:hover:scale-125 hover:z-50"
                      />
                    ))}
                  </div>
                </div>
              )}

              {task?.links?.length > 0 && (
                <div>
                  <p className="text-lg font-semibold">SUPPORT LINKS</p>
                  <div className="w-full flex flex-col gap-4">
                    {task.links.map((el, index) => (
                      <a
                        key={index}
                        href={el}
                        target="blank"
                        className="text-blue-600 hover:underline"
                      >
                        {el}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Activities activity={task?.activities} refetch={refetch} id={id} />
        )}
      </Tabs>
    </div>
  );
};

export default TaskDetail;
