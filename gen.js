import {writeFileSync, existsSync, readFileSync} from 'fs';
const srcdir="jc/book/";
const outdir="xml/";
const files=readFileSync('allfiles.txt','utf8').split(/\r?\n/);

export const writeChanged=(fn,buf,enc='utf8')=>{ //write to fn only if changed
    const oldbuf=existsSync(fn) && readFileSync(fn,enc);
    if (oldbuf!==buf) {
        writeFileSync(fn,buf,enc);
        return true;
    }
    return false;
}

// files.length=3;

const lst=['jicheng.xml'];
const maxlen=40;
const wrapline=line=>{
	const snippet=line.split(/(。)/);
	let s='',acc=0;
	for (let i=0;i<snippet.length;i++) {
		if (acc>0 && acc+ snippet[i].length>maxlen && snippet[i]!=='。') {
			acc=0;
			s+='\n';
		}
		s+=snippet[i];
		acc+=snippet[i].length;
	}
	return s;
}
const wraplines=content=>{
	const lines=content.split(/\r?\n/);
	const out=[];
	for (let i=0;i<lines.length;i++) {
		let wrapped=out.push( wrapline(lines[i]));
	}
	return out.join('\n');
}
const dofile=fn=>{
	let outfn=fn.replace('/','．')+'.xml';
	let content=readFileSync(srcdir+fn+'/index.html','utf8') //replace remark
	content=content.replace(/<header data-type="book">\n<h1>(.+)<\/h1>/,'<書名>$1</書名>');
	content=content.replace('</header>\n','');
	content=content.replace('<dl class="元資料">\n','')
	content=content.replace('</dl>\n','');
	content=content.replace(/<div><dt>作者<\/dt><dd>(.+)<\/dd><\/div>/,'<作者>$1</作者>');
	content=content.replace(/<div><dt>朝代<\/dt><dd>(.+)<\/dd><\/div>/,'<朝代>$1</朝代>');
	content=content.replace(/<div><dt>品質<\/dt><dd>(.+)<\/dd><\/div>/,'<品質>$1</品質>');
	content=content.replace(/<div><dt>年份<\/dt><dd><data value="(\d+)">公元(\d+)年<\/data><\/dd><\/div>/,'<年份>$1</年份>');
	
	content=content.replace(/<div><dt>底本<\/dt><dd>(.+)<\/dd><\/div>/,'<底本>$1</底本>');

	content=content.replace(/<a href="([^>]+)">([^>]+)<\/a>/,'<連 l="$1">$2</連>');

	content=content.replace(/<h1>([^>]+)<\/h1>/g,"<章>$1</章>");
	content=content.replace(/<h2>([^>]+)<\/h2>/g,"<節>$1</節>");
	content=content.replace(/<h3>([^>]+)<\/h3>/g,"<項>$1</項>");
	content=content.replace(/<h4>([^>]+)<\/h4>/g,"<目>$1</目>");
	content=content.replace(/<h5>([^>]+)<\/h5>/g,"<條>$1</條>");
	content=content.replace(/<u>/g,'<底>');
	content=content.replace(/<\/u>/g,'</底>');
	const wrapped=wraplines(content).replace(/<p>/g,'◇').replace(/<\/p>/g,'')
	.replace(/<[a-z][^>]*>/g,'').replace(/<\/[a-z][^>]*>/g,'')
	.replace(/<!--/g,'△')
	.replace(/-->/g,'▲')
	.replace(/△\r?\n▲/g,'')
	.replace(/。\r?\n）/g,'。）\n')

	lst.push(outfn);
	//accelon3 utf8 doesn't allow surrogate, need ucs2
	if (writeChanged(outdir+outfn,"\ufeff"+wrapped,'ucs2')) console.log('write',outfn)
}
files.map(dofile);
writeChanged(outdir+'jc.lst',lst.join('\n'));