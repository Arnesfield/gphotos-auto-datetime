# gphotos-auto-datetime

Google Photos automation script to set the date and time for photos based on the file name.

File name date formats that are recognized by this script:

- `yyyyMMdd_hhmmss`
- `yyyyMMdd-hhmmss`
- `yyyyMMddhhmmss`
- `yyyy-MM-dd hh-mm-ss`
- `yyyy-MM-dd_hh-mm-ss`
- `d MMMM yyyy hh∶mm∶ss`

Full file name strings that are valid date strings for the [`Date()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date) constructor are also recognized. This is probably not useful for real file names (since they may contain other information), but this can be helpful for `adt.parse(input)`.

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
