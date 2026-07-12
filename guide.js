const guideUrl = 'https://emerickchasse.github.io/GPTShipping/care-guide.html';
const guideTitle = 'A gentler pet-hair reset for the pet-loving home';
const shareMessage = document.querySelector('#share-message');

function copyGuideUrl() {
  const temporaryInput = document.createElement('textarea');
  temporaryInput.value = guideUrl;
  temporaryInput.setAttribute('readonly', '');
  temporaryInput.style.position = 'fixed';
  temporaryInput.style.opacity = '0';
  document.body.append(temporaryInput);
  temporaryInput.select();
  const copied = document.execCommand('copy');
  temporaryInput.remove();
  if (!copied) throw new Error('Unable to copy the link.');
}

document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#share-guide').addEventListener('click', async () => {
  try {
    if (navigator.share) {
      await navigator.share({ title: guideTitle, text: 'A few small habits for a calmer pet-loving home.', url: guideUrl });
      shareMessage.textContent = 'Thanks for sharing a calmer reset.';
      return;
    }
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(guideUrl);
    else copyGuideUrl();
    shareMessage.textContent = 'Guide link copied — ready to share.';
  } catch (error) {
    if (error.name !== 'AbortError') shareMessage.textContent = 'The link is ready in your browser address bar.';
  }
});
