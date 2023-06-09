import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState } from "react";
import { useRouter } from "next/router";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoneIcon from "@mui/icons-material/Done";

export default function CopyUrl() {
  const router = useRouter();

  const [copy, setCopy] = useState(false);

  const fullPath =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://app.filmingo.us";

  if (copy) {
    setTimeout(() => {
      setCopy(false);
    }, 2000);
  }

  return (
    <div className="absolute m-2 z-20">
      <CopyToClipboard
        text={fullPath + router.asPath}
        onCopy={() => setCopy(true)}
      >
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 "
        >
          {copy ? (
            <DoneIcon className="w-5 h-5" fontSize="small" />
          ) : (
            <ContentCopyIcon className="w-5 h-5" fontSize="small" />
          )}
        </button>
      </CopyToClipboard>
    </div>
  );
}
