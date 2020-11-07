FilePond.registerPlugin(
	FilePondPluginImagePreview,
	FilePondPluginImageResize,
	FilePondPluginFileEncode,
)
// Set all options for our file instances
// imageResizeTargetWidth and Height helps us to store a fixed sized image into our server
FilePond.setOptions({
	stylePanelAspectRatio: 150 / 100,
	imageResizeTargetWidth: 100,
	imageResizeTargetHeight: 150
})

// We are parsing all of our file inputs into file pond objects
FilePond.parse(document.body);