# gphotos-auto-datetime

Google Photos automation script to set the date and time for photos based on the file name.

File name conventions that are recognized by this script:

- `YYYYMMDD_HHMMSS.ext`
- `Screenshot_YYYYMMDD_HHMMSS_APPNAME.ext`
- `Screenshot_YYYYMMDD-HHMMSS_APPNAME.ext`
- `Screenshot from YYYY-MM-DD HH-MM-SS[-NTH].ext`
- `GAMEID_YYYYMMDDHHMMSS_NTH.ext`

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

4. Open the browser developer console for that page.

5. Paste and enter the script contents.

6. Stop the script by closing the browser tab or entering `adt.stop()` on the console.

## License

Licensed under the [MIT License](LICENSE).
