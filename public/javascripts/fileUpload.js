const rootStyles = window.getComputedStyle(document.documentElement)
// We do the following check to make sure that the style is already uploaded
if(rootStyles.getPropertyValue('--book-cover-width-large') != null && 
	rootStyles.getPropertyValue('--book-cover-width-large') != ''){
	ready()
} 
else{
	document.getElementById('main-css').addEventListener('load', ready)
}

function ready(){

	const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
	const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
	const coverHeight = coverWidth / coverAspectRatio
	FilePond.registerPlugin(
	FilePondPluginImagePreview,
	FilePondPluginImageResize,
	FilePondPluginFileEncode,
	)
	// Set all options for our file instances
	// imageResizeTargetWidth and Height helps us to store a fixed sized image into our server
	FilePond.setOptions({
		stylePanelAspectRatio: 1/coverAspectRatio,
		imageResizeTargetWidth: coverWidth,
		imageResizeTargetHeight: coverHeight
	})

	// We are parsing all of our file inputs into file pond objects
	FilePond.parse(document.body);
}
