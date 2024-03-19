import csv
from unidecode import unidecode



def create_frontmatter(row):
    frontmatter = "---\n"
    frontmatter += "layout: page\n"
    frontmatter += f"title: '{row.get('title', '')}'\n"
    frontmatter += f"permalink: /{row.get('status', '').lower()}/{unidecode(row.get('title', '')).replace(' ', '_').lower()}\n"
    frontmatter += f"plano_date_inicio: '{row.get('Início', '')}'\n"
    frontmatter += f"plano_date_fim: '{row.get('Fim', 'atualmente')}'\n"
    frontmatter += f"plano_gestao: '{row.get('Prefeito', '')}'\n"
    frontmatter += f"plano_administracao: '{row.get('Ato Normativo', '')}'\n"
    frontmatter += f"plano_secretaria: '{row.get('Órgão Coordenador', '')}'\n"
    frontmatter += f"plano_resume: '{row.get('desc', '')}'\n"
    frontmatter += "---\n"
    frontmatter += "<div>\n{% include _page_plano.html %}\n</div>\n"
    return frontmatter

with open('planos.csv', mode='r', encoding='utf-8-sig') as csv_file:
    csv_reader = csv.DictReader(csv_file)
    i = 0
    for row in csv_reader:
        if row.get('status') != 'Encerrado' and row.get('status') != 'Elaborado':
            continue
        filename = f"{unidecode(row['title'].replace(' ', '_').lower())}.md"

        content = create_frontmatter(row)

        with open(filename, mode='w', encoding='utf-8') as md_file:
            md_file.write(content)
        i += 1

    print(f'Criadas {i} páginas.')