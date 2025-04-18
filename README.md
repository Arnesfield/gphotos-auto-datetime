# gphotos-auto-datetime

Google Photos automation script to set the date and time for photos based on the file name.

File name conventions that are recognized by this script:

- `yyyyMMdd_hhmmss[-NTH].ext`
- `Screenshot_yyyyMMdd_hhmmss_APPNAME.ext`
- `Screenshot_yyyyMMdd-hhmmss_APPNAME.ext`
- `Screenshot from yyyy-MM-dd hh-mm-ss[-NTH].ext`
- `GAMEID_yyyyMMddhhmmss_NTH.ext`
- `dd MMMM yyyy hh∶mm∶ss.ext`
- Any valid date string for the [`Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) constructor

> [!CAUTION]
>
> **THIS WILL UPDATE DATE AND TIME OF PHOTOS BASED ON THE FILE NAME. USE WITH CAUTION.**

## Usage

1. Copy the script contents from [release/index.min.js](https://github.com/Arnesfield/gphotos-auto-datetime/raw/release/index.min.js).

   - (Linux) Run the following in your terminal:

     ```sh
     wget --no-cache -O - github.com/Arnesfield/gphotos-auto-datetime/raw/release/index.min.js | xclip -selection clipboard
     ```

2. Go to your Google Photos page (<https://photos.google.com>).

3. Click on the first photo (from an album is also recommended).

4. Click on the **Info** icon button to keep the info side panel open.

5. Open the browser developer console for that page.

6. Paste and enter the script contents.

7. Stop the script by closing the browser tab or entering `adt.stop()` on the console.

## License

Licensed under the [MIT License](LICENSE).
