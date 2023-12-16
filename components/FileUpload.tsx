import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { socket } from "@/context/socketUrl";
import { useRouter } from "next/router";

const Video = dynamic(() => import("./video"));

const FileUpload = () => {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const router = useRouter();
  const { id: roomName } = router.query;

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);

    const file = event.dataTransfer.files[0];
    setFile(URL.createObjectURL(file));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Displays the file name
    setFile(URL.createObjectURL(file)); // Displays the file blob
  };

  function handleClick() {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    fileInput.click();
  }

  function handleSearch() {
    setFile(null);
    setTitle(url);
    socket.emit("room-video-id", url, { room: roomName });
  }

  useEffect(() => {
    socket.on("room-video-id", (videoId) => {
      setTitle(videoId);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <input type="file" className="hidden" onChange={handleFileChange} />
      {file || title ? (
        <div className="flex flex-col items-center justify-center">
          <div>
            <Video videoFilePath={file || title} />
          </div>

          {/* <div className="flex p-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="url"
                id="url"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Paste Url"
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="submit"
                className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-gray-700 mb-2 pl-2">or</p>
            </div>
            <button
              className="ml-3 shrink-0  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClick}
            >
              Select file
            </button>
          </div> */}


          <button

            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-full "
            onClick={() => {
              setFile(null);
              setTitle(null);
            }}
          >
            Clear
          </button>
        </div>
      ) : (
        <div
          className={
            `relative border-2  border-dashed rounded-md p-4 ${dragging ? "border-blue-500" : "border-gray-500 p-20"
            }` + (file ? "hidden" : "")
          }
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div>
              <p className="text-gray-500 mb-2">
                Drag and drop your file here
              </p>
              <p className="text-gray-300 text-xs">
                or{" "}
                <button
                  className="text-blue-500 underline"
                  onClick={handleClick}
                >
                  select a file
                </button>{" "}
                from your computer
              </p>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-gray-500 mb-2 pl-2">or</p>
            </div>
            <div>
              <div className="relative text-gray-600">
                <input type="url" id="url" name="url" placeholder="Search" className="bg-gray-700 h-10 px-5 pr-10 rounded-full text-sm focus:outline-none text-gray-200" onChange={(e) => setUrl(e.target.value)} />
                <button type="submit" className="absolute right-0 top-0 mt-3 mr-4 text-blue-500" onClick={handleSearch}>
                  <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 56.966 56.966" width="512px" height="512px">
                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
