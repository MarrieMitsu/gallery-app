// Processing Class
class Processing{
	static getImages(url){
		fetchGET(url)
			.then( res => {
				Interface.displayImages(res);
			});
	}

	static uploadImage(url, image){
		const file = new FormData();
		file.append('img', image);

		fetchPOST(url, file)
			.then( res => {
				this.getImages(url);
			});
	}

	static deleteImage(url, data){
		fetchDELETE(url, data)
			.then( res => {
				console.log(res);
			});
	}
}

// Interface Class
class Interface{
	static displayImages(data){
		const galleryContainer = document.querySelector('.gallery .flex-container');
		galleryContainer.innerHTML = '';

		data.forEach( (val, i) => {
			const flexItem = document.createElement('div');
			flexItem.classList.add('flex-item');
			const content = `
				<div id="${val.code}" class="gallery-box">
					<div class="image-box">
						<img src="asset/upload/${val.url}">
					</div>
					<div class="action-box">
						<span class="view">View</span>
					</div>
					<div class="props">
						<i class="icon-download" title="Download"></i>
						<i class="icon-bin" title="Hapus"></i>
						<i class="icon-info" title="Info Detail"></i>
					</div>
					<div class="info-box hide">
						<i class="icon-close"></i>
						<h2>Details</h2>
						<span>Upload : ${formatDate(val.date)}</span>
						<span>Name : ${val.name}</span>
						<span>Size : ${formatBytes(val.size)}</span>
						<span>Type : ${val.type}</span>
						<span>Width : ${val.width} pixels</span>
						<span>Height : ${val.height} pixels</span>
					</div>
					<div class="selection-box hide">
						<label for="checkbox-${i}">
							<input id="checkbox-${i}" type="checkbox">
							<div class="circle"></div>
						</label>
					</div>
				</div>
			`;

			flexItem.innerHTML = content;
			galleryContainer.appendChild(flexItem);
		});
	}

	static viewImage(imgUrl, imageViewer){
		const closeBtn = imageViewer.childNodes[1];
		const imgTarget = imageViewer.childNodes[3].childNodes[1];
		const body = document.querySelector('body');

		// Show
		body.style.overflow = 'hidden';
		imageViewer.classList.remove('hide');
		imageViewer.classList.add('show');
		imgTarget.src = '';
		imgTarget.src = imgUrl;
		imageConfig();

		// Close
		closeBtn.addEventListener('click', () => {
			body.style.overflow = 'auto';
			imageViewer.classList.remove('show');
			imageViewer.classList.add('hide');
		});
	}

	static showDetail(elLayout, closeBtn){
		// Show
		elLayout.classList.remove('hide');
		elLayout.classList.add('show');

		// Close
		closeBtn.addEventListener('click', () => {
			elLayout.classList.remove('show');
			elLayout.classList.add('hide');
		});
	}

	static selectionMode(removeBtn){
		if (!removeBtn.classList.contains('none')) {
			removeBtn.classList.add('none');
		}

		$$('.gallery-box', function(){
			const checkbox = this.childNodes[9].childNodes[1].childNodes[1];
			const customCheckbox = this.childNodes[9].childNodes[1].childNodes[3];

			// Reset checkbox
			checkbox.checked = false;
			customCheckbox.classList.remove('active');

			// Check if info-box in opened up
			if (this.childNodes[7].classList.contains('show')) {
				this.childNodes[7].classList.remove('show');
				this.childNodes[7].classList.add('hide');
			}

			// Check amount of active input
			customCheckbox.addEventListener('click', () => {
				customCheckbox.classList.toggle('active');
				const activeInput = document.querySelectorAll('.active').length;	
				if (activeInput == 1) {
					removeBtn.classList.remove('none');
				}else if (activeInput == 0) {
					removeBtn.classList.add('none');;
				}
			});

			// Hide
			this.childNodes[3].classList.toggle('hide');
			this.childNodes[5].classList.toggle('hide');

			// Show
			this.childNodes[9].classList.toggle('hide');
		});
	}

	static getSelectedInput(){
		let codes = [];
		let fileName = [];

		document.querySelectorAll('.gallery-box').forEach( el => {
			const checkbox = el.childNodes[9].childNodes[1].childNodes[1];
			const image = el.childNodes[1].childNodes[1].src.split('/').pop(-1);
			
			if (checkbox.checked === true) {
				codes.push(el.id);
				fileName.push(image);
			}
		});

		return [codes, fileName];
	}

	static removeImage(){
		$$('.gallery-box', function(){
			const parent = this.parentNode;
			const checkbox = this.childNodes[9].childNodes[1].childNodes[1];
			if (checkbox.checked === true) {
				parent.style.animation = 'Hide .7s ease-out';
				parent.addEventListener('animationend', () => {
					parent.style.display = 'none';
					Processing.getImages(path);
				});
			}
		})
	}
}

// Gallery Event Class
class GalleryEvent{
	static iconInfo(el){
		const infoBox = el.parentNode.nextElementSibling;
		const close = infoBox.childNodes[1];

		Interface.showDetail(infoBox, close);
	}

	static iconBin(el){
		const parent = el.parentNode.parentNode.parentNode;
		
		const code = el.parentNode.parentNode.id;
		const image = el.parentNode.parentNode.childNodes[1].childNodes[1].src.split('/').pop(-1);
		let data = [[code], [image]];

		Processing.deleteImage(path, data);
		parent.style.animation = 'Hide .7s ease-out';
		parent.addEventListener('animationend', () => {
			parent.style.display = 'none';
			Processing.getImages(path);
		});
	}

	static iconDownload(el){
		const url = el.parentNode.parentNode.childNodes[1].childNodes[1].src;
		download(url);
	}

	static actionBox(el){
		const imgUrl = el.parentNode.childNodes[1].childNodes[1].src;
		const imageViewer = document.querySelector('.image-viewer');

		Interface.viewImage(imgUrl, imageViewer);
	}
}

// Display Event
document.addEventListener('DOMContentLoaded', () => {
	Processing.getImages(path);
});

// Gallery Event
document.querySelector('.gallery').addEventListener('click', e => {
	const element = e.target;

	if (element.classList.contains('icon-info')) {
		GalleryEvent.iconInfo(element);
	}else if(element.classList.contains('icon-bin')){
		GalleryEvent.iconBin(element);
	}else if(element.classList.contains('icon-download')){
		GalleryEvent.iconDownload(element);
	}else if(element.classList.contains('action-box')){
		GalleryEvent.actionBox(element);
	}
});

// Upload Event
$$('#upload', function(){
	this.addEventListener('change', () => {
		Processing.uploadImage(path, this.files[0]);
	});
});

// Selection Event
$$('.menu', function(){
	const selectionBtn = this.childNodes[3];
	const removeBtn = this.childNodes[5];
	
	// Selection Mode
	selectionBtn.addEventListener('click', () => {
		Interface.selectionMode(removeBtn);
	});

	// Remove Selected Images
	removeBtn.addEventListener('click', () => {
		const data = Interface.getSelectedInput();

		Processing.deleteImage(path, data);
		removeBtn.classList.add('none');
		Interface.removeImage();
	});

});