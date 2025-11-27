// // import { useEffect, useState } from "react";
// // import { useGetAllTaskQuery } from "../redux/slices/api/taskApiSlice";
// // import { usePredictDeadlineMutation } from "../redux/slices/api/geminiApiSlice";
// // import { Loading } from "../components";

// // const PredictDeadline = () => {
// //   const { data, isLoading } = useGetAllTaskQuery({});
// //   const [predictDeadline] = usePredictDeadlineMutation();

// //   const [task, setTask] = useState(null);
// //   const [images, setImages] = useState([]);
// //   const [prediction, setPrediction] = useState(null);

// //   useEffect(() => {
// //     if (!data?.tasks?.length) return;

// //     // Pick first task in progress
// //     const inProgressTask = data.tasks.find((t) => t.stage === "in progress");
// //     if (!inProgressTask) return;

// //     setTask(inProgressTask);

// //     // Convert screenshots buffer to base64
// //     if (inProgressTask.screenshots?.length > 0) {
// //       const converted = inProgressTask.screenshots.map((s) =>
// //         s?.data ? `data:image/png;base64,${btoa(String.fromCharCode(...s.data))}` : null
// //       ).filter(Boolean);
// //       setImages(converted);
// //     }

// //     // Call prediction API
// //     const fetchPrediction = async () => {
// //       try {
// //         const response = await predictDeadline({ taskId: inProgressTask._id }).unwrap();
// //         setPrediction(response.predictedDeadline); // adjust field from backend
// //       } catch (err) {
// //         console.error("Prediction error:", err);
// //       }
// //     };

// //     fetchPrediction();
// //   }, [data]);

// //   if (isLoading || !task) return <Loading />;

// //   return (
// //     <div className="w-full p-8">
// //       <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
// //       <p className="text-gray-600 mb-4">Current Stage: {task.stage}</p>

// //       {prediction && (
// //         <div className="mb-6 p-4 bg-green-100 rounded">
// //           <h2 className="text-lg font-semibold">Predicted Deadline:</h2>
// //           <p className="text-gray-700">{prediction}</p>
// //         </div>
// //       )}

// //       {images.length > 0 ? (
// //         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
// //           {images.map((img, i) => (
// //             <img
// //               key={i}
// //               src={img}
// //               alt={`screenshot-${i}`}
// //               className="rounded shadow hover:scale-105 transition-all duration-300"
// //             />
// //           ))}
// //         </div>
// //       ) : (
// //         <p className="text-gray-500">No screenshots available for this task yet.</p>
// //       )}
// //     </div>
// //   );
// // };

// // export default PredictDeadline;


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetSingleTaskQuery } from "../redux/slices/api/taskApiSlice";
import { usePredictDeadlineMutation } from "../redux/slices/api/geminiApiSlice";
import { Loading } from "../components";

const PredictDeadline = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: taskData, isLoading } = useGetSingleTaskQuery(id);
  const [predictDeadline] = usePredictDeadlineMutation();
  // const response = await predictDeadline({ taskId: id }).unwrap();


  const [images, setImages] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const task = taskData?.task;

  useEffect(() => {
    if (!task) return;

    if (task.stage !== "in progress") {
      alert("Task is not in progress. Cannot predict deadline.");
      navigate(-1);
      return;
    }

    // Convert screenshots buffer to base64
    if (task.screenshots?.length > 0) {
      const converted = task.screenshots.map((s) =>
        s?.data ? `data:image/png;base64,${btoa(String.fromCharCode(...s.data))}` : null
      ).filter(Boolean);
      setImages(converted);
    }

    // Call prediction API
    const fetchPrediction = async () => {
      try {
        const response = await predictDeadline({ taskId: task._id }).unwrap();
        setPrediction(response.predictedDeadline);
      } catch (err) {
        console.error("Prediction error:", err);
      }
    };

    fetchPrediction();
  }, [task]);

  if (isLoading) return <Loading />;

  if (!task) return <p className="text-gray-500">Task not found.</p>;

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-600 mb-4">Current Stage: {task.stage}</p>

      {prediction && (
        <div className="mb-6 p-4 bg-green-100 rounded">
          <h2 className="text-lg font-semibold">Predicted Deadline:</h2>
          <p className="text-gray-700">{prediction}</p>
        </div>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`screenshot-${i}`}
              className="rounded shadow hover:scale-105 transition-all duration-300"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No screenshots available for this task yet.</p>
      )}
    </div>
  );
};

export default PredictDeadline;

// import { usePredictDeadlineQuery } from "../redux/slices/api/geminiApiSlice";
// import { useGetSingleTaskQuery } from "../redux/slices/api/taskApiSlice";
// import propTypes from 'prop-types'

// const PredictDeadline = ({ taskId }) => {
//   const { data: taskData } = useGetSingleTaskQuery(taskId);
//   const [predictDeadline, { data, isLoading, error }] = usePredictDeadlineQuery();

//   const handleAnalyze = async () => {
//     if (!taskData) return;

//     // Convert screenshots to base64
//     const screenshotsBase64 = taskData.task.screenshots
//       .map((s) => convertBufferToBase64(s.data))
//       .filter(Boolean);

//     const payload = {
//       title: taskData.task.title,
//       description: taskData.task.description,
//       stage: taskData.task.stage,
//       screenshots: screenshotsBase64,
//     };

//     await predictDeadline({ taskId, taskData: payload });
//   };

//   return (
//     <div className="p-6">
//       <button
//         onClick={handleAnalyze}
//         disabled={isLoading}
//         className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
//       >
//         {isLoading ? "Analyzing..." : "Predict Deadline / Generate Report"}
//       </button>

//       {data && (
//         <div className="mt-4 bg-gray-100 p-4 rounded-lg">
//           <h3 className="text-lg font-semibold">AI Report</h3>
//           <p>{data.report}</p>
//           {data.deadline && (
//             <p className="mt-2 font-medium text-gray-800">
//               🕒 Predicted Deadline: {data.deadline}
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// PredictDeadline.propTypes = {
//   taskId: propTypes.string.isRequired,
// }

// export default PredictDeadline;