import { cacheFn } from 'ps-std';

const nsblob = (window as any).nsblob;

export const makeLinkFromHTML = cacheFn(async (html: string) => {
	const hash = await nsblob.store(html);
	const response = await fetch(
		`https://l.og.ax/https://cdn.nodesite.eu:20122/${hash}.html`
	);
	const url = await response.text();

	return url;
});
