const fs = require('fs');

const projectsData = JSON.parse(fs.readFileSync('projects-data.json', 'utf8'));
const readmePath = 'README.md';
const readme = fs.readFileSync(readmePath, 'utf8');

const THUMB_WIDTH = 260;
const THUMB_HEIGHT = 150;

function generateProjectsTable(projects) {
  const rows = [];

  const shimmerCell = `<td align="center"><img src="assets/thumbs/coming-soon.svg" alt="Coming Soon"><br/>⎯⎯⎯⎯<br/><strong>Coming Soon</strong><br/><a href="https://github.com/ULTRASIRI">Stay tuned</a></td>`;

  for (let i = 0; i < projects.length; i += 3) {
    const rowProjects = projects.slice(i, i + 3);
    const cells = rowProjects.map((p) => {
      const links = [
        p.codeUrl ? `<a href="${p.codeUrl}">Code</a>` : null,
        p.liveUrl ? `<a href="${p.liveUrl}">Live</a>` : null,
      ]
        .filter(Boolean)
        .join(' · ');

      const imgTag = `<img src="${p.thumbnail}" width="${THUMB_WIDTH}" height="${THUMB_HEIGHT}">`;
      const thumbnail = p.liveUrl
        ? `<a href="${p.liveUrl}">${imgTag}</a>`
        : p.codeUrl
        ? `<a href="${p.codeUrl}">${imgTag}</a>`
        : imgTag;

      return `<td align="center">\n${thumbnail}<br/>⎯⎯⎯⎯<br/>\n<strong>${p.title}</strong><br/>\n${links}\n</td>`;
    });

    // Fill empty cells with shimmer placeholder
    while (cells.length < 3) {
      cells.push(shimmerCell);
    }

    rows.push(`<tr>\n${cells.join('\n')}\n</tr>`);
  }

  return `<table>\n${rows.join('\n')}\n</table>`;
}

const tableHtml = generateProjectsTable(projectsData.projects);
const projectCount = projectsData.projects.length;
const headerHtml = `## Projects <sup>${projectCount}</sup> ↘️`;
const startMarker = '<!-- PROJECT-TABLE-START -->';
const endMarker = '<!-- PROJECT-TABLE-END -->';

let newReadme;
if (readme.includes(startMarker) && readme.includes(endMarker)) {
  newReadme = readme.replace(
    new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`),
    `${startMarker}\n${headerHtml}\n\n${tableHtml}\n${endMarker}`
  );
} else {
  console.error('Missing <!-- PROJECT-TABLE-START --> and <!-- PROJECT-TABLE-END --> markers in README.md');
  process.exit(1);
}

fs.writeFileSync(readmePath, newReadme);
console.log(`README.md updated successfully with ${projectCount} projects!`);