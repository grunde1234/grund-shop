for uploadthings flow 
```
Browser → uploads directly to UploadThing's storage (bytes never pass through your server)
Your server → only runs auth/middleware checks + saves the returned URL to your DB
UploadThing CDN → serves the file back out whenever it's requested
```
## What your server does do instead — just two small things:

* Before upload: the browser asks your server, "am I allowed to upload this?" Your server runs your .middleware() — checks auth, permissions, etc. — and if it's fine, just hands back permission (a signed URL) for the browser to upload directly to UploadThing.
* After upload: UploadThing tells your server "this file finished uploading, here's its URL" (that's your onUploadComplete/onClientUploadComplete callback). Your server just saves that URL string to your database.