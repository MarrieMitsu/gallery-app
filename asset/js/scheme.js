// Global Variable
var path = 'http://localhost/lab/gallery/Api/Api.php';

// Multiple selector
const $$ = (element, callback) => {
	element = document.querySelectorAll(element);
	if (typeof callback == 'function') {
		element.forEach( (val, i) => {
			callback.call(element[i]);
		});
		return element;
	}
}

// Image Configuration
const imageConfig = () => {
	$$('.image-viewer-box', function(){
		const imgWidth = this.childNodes[1].clientWidth;
		const imgHeight = this.childNodes[1].clientHeight;
		const tablet = window.matchMedia('(min-width: 426px) and (max-width: 768px)');
		const mobile = window.matchMedia('(min-width: 0px) and (max-width: 425px)');
		
		if (tablet.matches) {
			if (imgWidth > imgHeight) {
				this.style.width = '90%';
				this.style.height = 'auto';
			}else if(imgWidth < imgHeight){
				this.style.width = 'auto';
				this.style.height = '95%';	
			}else if (imgWidth === imgHeight){
				this.style.width = 'auto';
				this.style.height = 'auto';
			}
			this.style.marginTop = `-${this.clientHeight / 2}px`;
		}else if(mobile.matches){
			if (imgWidth > imgHeight) {
				this.style.width = '100%';
			}else if(imgWidth < imgHeight){
				this.style.width = '82%';
			}else if (imgWidth === imgHeight){
				this.style.width = '85%';
			}
			this.style.marginTop = `-${this.clientHeight / 2}px`;
		}else{
			this.style.height = '95%';
			this.style.marginTop = `-${this.clientHeight / 2}px`;	
		}

	});
}

// Download
const download = url => {
	const a = document.createElement('a');
	const output = url.split('/').slice(-1)[0];

	a.href = url;
	a.download = output;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

// Format Date
const formatDate = date => {
	const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu'];
	const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
	let c = new Date(date);

	// Redefine date
	const day = hari[c.getDay()];
	const d = ('0' + c.getDate()).slice(-2);
	const month = bulan[c.getMonth()];
	const year = c.getFullYear();
	const h = ('0' + c.getHours()).slice(-2);
	const m = ('0' + c.getMinutes()).slice(-2);
	const s = ('0' + c.getSeconds()).slice(-2);

	const fullDate = `${day}, ${d} ${month} ${year} (${h}:${m}:${s})`;
	return fullDate;
}

// Format Bytes
const formatBytes = bytes => {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const decimalPoint = 2;
	const sizes = ['Bytes', 'kB', 'MB', 'GB'];
	var i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPoint)) + ' ' + sizes[i];
}

// Fetch Get
const fetchGET = async url => {
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			'Content-Type' : 'application/json'
		}
	});
	return await response.json();
}

// Fetch Post
const fetchPOST = async (url, data) => {
	const response = await fetch(url, {
		method: 'POST',
		body: data
	});
	return await response.json();
}

// Fetch Delete
const fetchDELETE = async (url, data) => {
	const response = await fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type' : 'application/json'
		},
		body: JSON.stringify(data)
	});
	return await response.json();
}