// "use client"

// import { useEffect, useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { useGetSingleTaskQuery } from "../redux/slices/api/taskApiSlice"
// import { usePredictDeadlineMutation } from "../redux/slices/api/geminiApiSlice"
// import { Loading } from "../components"

// const PredictDeadlines = () => {
//   const { id } = useParams()
//   const navigate = useNavigate()
//   const { data: taskData, isLoading } = useGetSingleTaskQuery(id)
//   const [predictDeadline] = usePredictDeadlineMutation()

//   const [images, setImages] = useState([])
//   const [prediction, setPrediction] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const task = taskData?.task

//   useEffect(() => {
//     if (!task) return

//     if (task.stage !== "in progress") {
//       alert("Task is not in progress. Cannot predict deadline.")
//       navigate(-1)
//       return
//     }

//     // Convert screenshots buffer to base64
//     let converted = []
//     if (task.screenshots?.length > 0) {
//       converted = task.screenshots
//         .map((s) => (s?.data ? `data:image/png;base64,${btoa(String.fromCharCode(...s.data))}` : null))
//         .filter(Boolean)
//       setImages(converted)
//     }

//     // Call prediction API
//     const fetchPrediction = async () => {
//       setLoading(true)
//       try {
//         const response = await predictDeadline({
//           taskId: task._id,
//           title: task.title,
//           description: task.description,
//           stage: task.stage,
//           screenshots: converted, // Pass screenshots to backend
//         }).unwrap()
//         setPrediction(response.report)
//       } catch (err) {
//         console.error("Prediction error:", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchPrediction()
//   }, [task])

//   if (isLoading) return <Loading />

//   if (!task) return <div>Task not found.</div>

//   return (
//     <div>
//       <h1>{task.title}</h1>
//       <p>Current Stage: {task.stage}</p>

//       {loading && <p>Analyzing images with AI...</p>}

//       {prediction && (
//         <div>
//           <h2>AI Analysis Report:</h2>
//           <p>{prediction}</p>
//         </div>
//       )}

//       {images.length > 0 ? (
//         <div>
//           <h3>Screenshots ({images.length}):</h3>
//           {images.map((img, i) => (
//             <img key={i} src={img || "/placeholder.svg"} alt={`Screenshot ${i + 1}`} style={{ maxWidth: "400px" }} />
//           ))}
//         </div>
//       ) : (
//         <p>No screenshots available for this task yet.</p>
//       )}
//     </div>
//   )
// }

// export default PredictDeadlines

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Removed useNavigate
import { useGetSingleTaskQuery } from "../redux/slices/api/taskApiSlice";
import { usePredictDeadlineMutation } from "../redux/slices/api/geminiApiSlice";
import { Loading, Button } from "../components";
import { convertBufferToBase64 } from "../utils"; 

const PredictDeadline = () => {
  const { id } = useParams();
  
  const { data: taskData, isLoading: isTaskLoading } = useGetSingleTaskQuery(id);
  const [predictDeadline, { isLoading: isPredicting }] = usePredictDeadlineMutation();

  const [images, setImages] = useState([]);
  const [result, setResult] = useState(null);

  const task = taskData?.task;

  useEffect(() => {
    if (task?.screenshots?.length > 0) {
      const converted = task.screenshots.map((s) => convertBufferToBase64(s)).filter(Boolean);
      setImages(converted);
    }
  }, [task]);

  const handlePredict = async () => {
    try {
      const response = await predictDeadline(id).unwrap();
      setResult(response);
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Failed to predict deadline. Check console for details.");
    }
  };

  if (isTaskLoading) return <Loading />;
  if (!task) return <p className="text-gray-500 p-8">Task not found.</p>;

  return (
    <div className="w-full p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <span className="text-sm text-gray-500 uppercase tracking-wide">{task.stage}</span>
        </div>
        <Button 
          onClick={handlePredict} 
          label={isPredicting ? "Analyzing..." : "Predict Deadline"} 
          className="bg-blue-600 text-white"
          disabled={isPredicting || images.length === 0}
        />
      </div>

      {result && (
        <div className="mb-8 p-6 bg-white shadow-lg rounded-lg border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">AI Prediction</h2>
          <div className="flex flex-col gap-2">
            <p className="text-lg"><strong>Estimated Deadline:</strong> {result.deadline}</p>
            <p className="text-gray-600"><strong>Analysis:</strong> {result.report}</p>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Screenshots Analyzed ({images.length})</h3>
        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="border rounded overflow-hidden shadow-sm">
                <img
                  src={img}
                  alt={`screenshot-${i}`}
                  className="w-full h-40 object-cover hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 bg-gray-100 rounded text-center text-gray-500">
            No screenshots have been recorded for this task yet. 
            <br/> Start In Progress status to begin tracking.
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictDeadline;