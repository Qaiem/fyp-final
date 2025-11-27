// import { useEffect, useState, useRef } from "react";
// import { FaList } from "react-icons/fa";
// import { IoMdAdd } from "react-icons/io";
// import { MdGridView } from "react-icons/md";
// import { useParams, useSearchParams } from "react-router-dom";
// import { Button, Loading, Table, Tabs, Title } from "../components";
// import { AddTask, BoardView, TaskTitle } from "../components/tasks";
// import {
//   useGetAllTaskQuery,
//   useUploadImageMutation,
// } from "../redux/slices/api/taskApiSlice";
// import { TASK_TYPE } from "../utils";
// import { useSelector } from "react-redux";
// import TaskDialog from "../components/tasks/TaskDialog";
// import { useTaskContext } from "../components/contextapi/TaskContext";
// import { useScreenRecording } from "../components/contextapi/RecordingContext";

// const TABS = [
//   { title: "Board View", icon: <MdGridView /> },
//   { title: "List View", icon: <FaList /> },
// ];

// const Tasks = () => {
//   const { taskId, taskStatus } = useTaskContext();
//   const { user } = useSelector((state) => state.auth);
//   const [searchParams] = useSearchParams();
//   const searchTerm = searchParams.get("search") || "";
//   const { stream, startRecording } = useScreenRecording();

//   const [selected, setSelected] = useState(0);
//   const [open, setOpen] = useState(false);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const videoRef = useRef(null);

//   const params = useParams();
//   const status = params?.status || "";

//   const { data, isLoading, refetch } = useGetAllTaskQuery({
//     strQuery: status,
//     isTrashed: "",
//     search: searchTerm,
//   });

//   const [uploadImage] = useUploadImageMutation();

//   // Handle screen recording
//   useEffect(() => {
//     if (stream && videoRef.current) {
//       videoRef.current.srcObject = stream;
//       videoRef.current.onloadedmetadata = () => videoRef.current.play();
//     }
//   }, [stream]);

//   useEffect(() => {
//     if (taskStatus) handleScreenShareStart();
//   }, [taskStatus]);

//   const handleScreenShareStart = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.onloadedmetadata = () => videoRef.current.play();
//       }
//       startRecording();
//       startTakingScreenshots(stream, taskId);
//     } catch (err) {
//       console.error("Error starting screen share:", err);
//     }
//   };

//   const startTakingScreenshots = (stream, taskId) => {
//     console.log("Task ID:", taskId);

//     if (!videoRef.current) {
//       console.log("Video reference not available.");
//       return;
//     }

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
//           try {
//             const arrayBuffer = await blob.arrayBuffer();
//             const uint8Array = new Uint8Array(arrayBuffer);
//             console.log("Uploading screenshot for task", taskId, uint8Array);
//             // Uncomment the upload call once backend ready
//             const response = await uploadImage({
//               taskId,
//               uint8Array, // Pass raw binary data
//             }).unwrap();
//             console.log("Image uploaded successfully:", response);
//           } catch (err) {
//             console.error("Screenshot upload failed:", err);
//           }
//         }, "image/png");
//       }
//     }, 5000);

//     stream.getVideoTracks()[0].onended = () => {
//       clearInterval(interval);
//       console.log("Screen sharing stopped, interval cleared.");
//     };
//   };

//   useEffect(() => {
//     refetch();
//     window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
//   }, [open]);

//   if (isLoading) return <Loading />;

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-4">
//         <Title title={status ? `${status} Tasks` : "Tasks"} />
//         {!status && user?.isAdmin && (
//           <Button
//             label="Create Task"
//             icon={<IoMdAdd className="text-lg" />}
//             className="flex flex-row-reverse gap-1 items-center bg-purple-600 text-white rounded-md py-2 2xl:py-2.5"
//             onClick={() => setOpen(true)}
//           />
//         )}
//       </div>

//       <Tabs tabs={TABS} setSelected={setSelected}>
//         {!status && (
//           <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
//             <TaskTitle label="To Do" className={TASK_TYPE.todo} />
//             <TaskTitle
//               label="In Progress"
//               className={TASK_TYPE["in progress"]}
//             />
//             <TaskTitle label="Completed" className={TASK_TYPE.completed} />
//           </div>
//         )}

//         {selected === 0 ? (
//           <BoardView tasks={data?.tasks || []} />
//         ) : (
//           <Table tasks={data?.tasks} />
//         )}
//       </Tabs>

//       {/* Hidden video element for screen recording */}
//       <video ref={videoRef} autoPlay style={{ display: "none" }} />

//       {/* Task dialog */}
//       {isDialogOpen && (
//         <TaskDialog
//           onScreenShareStart={handleScreenShareStart}
//           onClose={() => setIsDialogOpen(false)}
//         />
//       )}

//       <AddTask open={open} setOpen={setOpen} />
//     </div>
//   );
// };

// export default Tasks;

import { useEffect, useState, useRef } from "react";
import { FaList } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { MdGridView } from "react-icons/md";
import { useParams, useSearchParams } from "react-router-dom";
import { Button, Loading, Table, Tabs, Title } from "../components";
import { AddTask, BoardView, TaskTitle } from "../components/tasks";
import {
  useGetAllTaskQuery,
  useUploadImageMutation,
  useChangeTaskStageMutation,
} from "../redux/slices/api/taskApiSlice";
import { TASK_TYPE } from "../utils";
import { useSelector } from "react-redux";
import TaskDialog from "../components/tasks/TaskDialog";
import { useTaskContext } from "../components/contextapi/TaskContext";
import { useScreenRecording } from "../components/contextapi/RecordingContext";

const TABS = [
  { title: "Board View", icon: <MdGridView /> },
  { title: "List View", icon: <FaList /> },
];

const Tasks = () => {
  const { user } = useSelector((state) => state.auth);
  const { setTaskId } = useTaskContext();
  const { startRecording, stopRecording } = useScreenRecording();

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const videoRef = useRef(null);
  const [uploadImage] = useUploadImageMutation();
  const [changeStage] = useChangeTaskStageMutation();

  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";
  const params = useParams();
  const status = params?.status || "";

  const { data, isLoading, refetch } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: "",
    search: searchTerm,
  });

  // Attach media stream to hidden video tag
  const attachStream = (stream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => videoRef.current.play();
    }
  };

  // Function to start screen sharing and screenshots
  const handleScreenShareStart = async (activeTaskId) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      attachStream(stream);
      startRecording();
      startTakingScreenshots(stream, activeTaskId);
    } catch (err) {
      console.error("Error starting screen share:", err);
    }
  };

  // Capture screenshots every 5 seconds
  const startTakingScreenshots = (stream, activeTaskId) => {
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
          try {
            const arrayBuffer = await blob.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            await uploadImage({ taskId: activeTaskId, uint8Array }).unwrap();
            console.log("Screenshot uploaded for task:", activeTaskId);
          } catch (err) {
            console.error("Upload failed:", err);
          }
        }, "image/png");
      }
    }, 5000); // 5 minutes

    stream.getVideoTracks()[0].onended = () => {
      clearInterval(interval);
      sessionStorage.removeItem("screenTrackingActive");
      stopRecording();
      console.log("Screen sharing stopped, interval cleared.");
    };
  };

  // Auto resume screen recording if task is already "in progress"
  useEffect(() => {
    if (!data?.tasks?.length || user?.isAdmin) return;
    const inProgressTask = data.tasks.find(
      (task) => task.stage === "in progress"
    );
    if (inProgressTask) {
      setTaskId(inProgressTask._id);
      const tracking = sessionStorage.getItem("screenTrackingActive");
      if (!tracking) {
        handleScreenShareStart(inProgressTask._id);
        sessionStorage.setItem("screenTrackingActive", "true");
      }
    } else {
      sessionStorage.removeItem("screenTrackingActive");
      stopRecording();
    }
  }, [data]);

  // Handle status change manually from the UI
  const handleChangeStage = async (task, newStage) => {
    try {
      const res = await changeStage({ id: task._id, stage: newStage }).unwrap();
      console.log("Stage updated:", res);
      refetch();

      // If user is not admin and the stage changes from 'todo' to 'in progress'
      if (
        task.stage === "todo" &&
        newStage === "in progress" &&
        !user?.isAdmin
      ) {
        console.log("Task changed from TODO → IN PROGRESS — starting tracking");

        setTaskId(task._id);
        handleScreenShareStart(task._id);
        startTakingScreenshots(task._id);
        sessionStorage.setItem("screenTrackingActive", "true");
      }
    } catch (err) {
      console.error("Error changing stage:", err);
    }
  };

  // const handleChangeStage = async (task, newStage) => {
  //   try {
  //     const res = await changeStage({ id: task._id, stage: newStage }).unwrap();
  //     console.log("Stage updated:", res);
  //     refetch();

  //     if (newStage === "in progress" && !user?.isAdmin) {
  //       const now = new Date();
  //       const updatedTime = new Date();
  //       const diff = now - updatedTime;
  //       if (diff <= 5000) {
  //         console.log("Task switched to In Progress recently — start recording");
  //         setTaskId(task._id);
  //         handleScreenShareStart();
  //         startTakingScreenshots(task._id);
  //         sessionStorage.setItem("screenTrackingActive", "true");
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error changing stage:", err);
  //   }
  // };

  useEffect(() => {
    refetch();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [open]);

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title={status ? `${status} Tasks` : "Tasks"} />
        {!status && user?.isAdmin && (
          <Button
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-purple-600 text-white rounded-md py-2 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}

        {selected === 0 ? (
          <BoardView
            tasks={data?.tasks || []}
            onChangeStage={handleChangeStage}
          />
        ) : (
          <Table tasks={data?.tasks} onChangeStage={handleChangeStage} />
        )}
      </Tabs>

      <video ref={videoRef} autoPlay style={{ display: "none" }} />

      {isDialogOpen && (
        <TaskDialog
          onScreenShareStart={handleScreenShareStart}
          onClose={() => setIsDialogOpen(false)}
        />
      )}

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
