import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter} from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();
// * We are now generating two components, UploadButton and UploadDropzone, that are configured to work with our custom file router defined in our API routes. These components can be used in our React application to allow users to upload files according to the routes and configurations we've set up in our Next.js API.
