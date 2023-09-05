window.addEventListener('scroll', function()
{
	const navbar = this.document.getElementById('navbar');
	scrolled = this.window.scrollY > 70;

	navbar.classList.toggle('stick', scrolled);
	this.document.body.style.paddingTop = scrolled ? '70px' : '0';
})