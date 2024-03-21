import json


def parse_log_file(file_path):
    json_list = []  # Créer une liste pour stocker les objets JSON
    with open(file_path, 'r') as file:
        for line in file:
            line_parts = line.strip().split('|')
            if len(line_parts) >= 5:
                log_time = line_parts[0]
                json_data = line_parts[-1]
                try:
                    json_obj = json.loads(json_data)
                    json_obj['log_time'] = log_time
                    json_list.append(json_obj)  # Ajouter l'objet JSON à la liste
                except json.JSONDecodeError:
                    print(f"Ignoring line due to invalid JSON: {line}")
            else:
                print(f"Ignoring line due to insufficient parts: {line}")
    return json_list  # Retourner la liste d'objets JSON

if __name__ == "__main__":
    file_path = "CAMS.log"  # Remplacez "votre_fichier.log" par le chemin de votre fichier
    output_file = 'data.json'

    json_list = parse_log_file(file_path)  # Appeler la fonction pour obtenir la liste d'objets JSON

    with open(output_file, 'w') as f:
        json.dump(json_list, f, indent=4)  # Écrire la liste d'objets JSON dans le fichier de sortie au format JSON

    print(f"Données écrites dans {output_file}")
