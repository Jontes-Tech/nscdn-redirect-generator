<script lang="ts">
	import { makeLinkFromHTML } from './lib/makeLinkFromHTML';

	let title = '';
	let description = '';
	let image = '';
	let redirect_url = '';

	let html = '';
	let final = '';

	$: stag =
		'<scr' +
		'ipt>' +
		'location.href = "' +
		(redirect_url || 'https://jontes.page/') +
		'"' +
		'</scr' +
		'ipt>';

	/** /src/template.html */
	const template = atob(`
		PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KCTxoZWFkPgoJCTxtZXRhIGNoYXJzZXQ9
		IlVURi04IiAvPgoJCTxtZXRhIGh0dHAtZXF1aXY9IlgtVUEtQ29tcGF0aWJsZSIgY29udGVudD0i
		SUU9ZWRnZSIgLz4KCQk8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNl
		LXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCIgLz4KCgkJPCEtLSBQcmltYXJ5IE1ldGEgVGFncyAt
		LT4KCQk8dGl0bGU+X19USVRMRV9fPC90aXRsZT4KCQk8bWV0YSBuYW1lPSJ0aXRsZSIgY29udGVu
		dD0iX19USVRMRV9fIiAvPgoJCTxtZXRhIG5hbWU9ImRlc2NyaXB0aW9uIiBjb250ZW50PSJfX0RF
		U0NSSVBUSU9OX18iIC8+CgoJCTwhLS0gT3BlbiBHcmFwaCAvIEZhY2Vib29rIC0tPgoJCTxtZXRh
		IHByb3BlcnR5PSJvZzp0eXBlIiBjb250ZW50PSJ3ZWJzaXRlIiAvPgoJCTxtZXRhIHByb3BlcnR5
		PSJvZzp1cmwiIGNvbnRlbnQ9Imh0dHBzOi8vci5qb250ZXMucGFnZSIgLz4KCQk8bWV0YSBwcm9w
		ZXJ0eT0ib2c6dGl0bGUiIGNvbnRlbnQ9Il9fVElUTEVfXyIgLz4KCQk8bWV0YSBwcm9wZXJ0eT0i
		b2c6ZGVzY3JpcHRpb24iIGNvbnRlbnQ9Il9fREVTQ1JJUFRJT05fXyIgLz4KCQk8bWV0YSBwcm9w
		ZXJ0eT0ib2c6aW1hZ2UiIGNvbnRlbnQ9Il9fSU1BR0VfXyIgLz4KCgkJPCEtLSBUd2l0dGVyIC0t
		PgoJCTxtZXRhIHByb3BlcnR5PSJ0d2l0dGVyOmNhcmQiIGNvbnRlbnQ9InN1bW1hcnlfbGFyZ2Vf
		aW1hZ2UiIC8+CgkJPG1ldGEgcHJvcGVydHk9InR3aXR0ZXI6dXJsIiBjb250ZW50PSJodHRwczov
		L3Iuam9udGVzLnBhZ2UiIC8+CgkJPG1ldGEgcHJvcGVydHk9InR3aXR0ZXI6dGl0bGUiIGNvbnRl
		bnQ9Il9fVElUTEVfXyIgLz4KCQk8bWV0YSBwcm9wZXJ0eT0idHdpdHRlcjpkZXNjcmlwdGlvbiIg
		Y29udGVudD0iX19ERVNDUklQVElPTl9fIiAvPgoJCTxtZXRhIHByb3BlcnR5PSJ0d2l0dGVyOmlt
		YWdlIiBjb250ZW50PSJfX0lNQUdFX18iIC8+Cgk8L2hlYWQ+Cgk8Ym9keT4KCQlfX0JPRFlfXwoJ
		PC9ib2R5Pgo8L2h0bWw+Cg==
	`);

	$: html = template
		.replace(/__TITLE__/g, title)
		.replace(/__DESCRIPTION__/g, description)
		.replace(/__IMAGE__/g, image)
		.replace(/__BODY__/g, stag);

	let files: FileList;

	async function upload() {
		for (const file of files) {
			const response = await fetch(
				'https://cdn.discordapp.sk/api/upload',
				{
					method: 'PUT',
					headers: {
						'Content-Type': file.type,
						'Content-Length': String(file.size),
					},
					body: file,
				}
			);

			image = `https://cdn.discordapp.sk/static/${await response.text()}`;
		}
	}

	let fileselector: HTMLInputElement;
</script>

<main>
	<h1>Create fake links</h1>
	<table>
		<tr>
			<td>
				<label for="title">Title</label>
			</td>
			<td>
				<input id="title" bind:value={title} />
			</td>
		</tr>
		<tr>
			<td>
				<label for="image">Image</label>
			</td>
			<td>
				<input id="image" bind:value={image} />

				<input
					style="display:none"
					bind:this={fileselector}
					type="file"
					bind:files
					on:change={upload}
				/>

				<button on:click={() => fileselector.click()}>Upload</button>
			</td>
		</tr>
		<tr>
			<td>
				<label for="redirect_url">Redirect URL</label>
			</td>
			<td>
				<input id="redirect_url" bind:value={redirect_url} />
			</td>
		</tr>
		<tr>
			<td>
				<label for="description">Description</label>
			</td>
			<td>
				<textarea id="description" bind:value={description} />
			</td>
		</tr>
		<tr>
			<td />
			<td>
				<button
					on:click={() =>
						makeLinkFromHTML(html).then((link) => (final = link))}
					>Generate</button
				>
			</td>
		</tr>
		<tr>
			<td>
				<label for="final">Final URL</label>
			</td>
			<td>
				<input id="final" bind:value={final} />
			</td>
		</tr>
		<tr>
			<td />
			<td><a href={final}>{final}</a></td>
		</tr>
	</table>
	<a href="mailto:jonatan@jontes.page">Report misuse</a>
</main>

<style>
	td {
		text-align: left;
		padding: 0.3em;
	}
</style>
