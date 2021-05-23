import csv
import re

from pprint import pprint

faculty = {}

with open('csrankings.csv', newline='') as f:
    reader = csv.reader(f, delimiter=',', quotechar='\\')
    next(reader)
    for row in reader:
        #print(row)
        faculty[row[0]] = {'institution': row[1], 'homepage': row[2], 'scholar_profile': row[3]}

#print(faculty)

nlp_counts = {}

with open('generated-author-info.csv', newline='') as f:
    reader = csv.reader(f, delimiter=',', quotechar='\\')
    next(reader)
    for row in reader:
        if row[2] != 'emnlp' and row[2] != 'acl' and row[2] != 'naacl':
            continue
        if row[0] in nlp_counts:
            nlp_counts[row[0]] = nlp_counts[row[0]] + 1
        else:
            nlp_counts[row[0]] = 1

nlp_faculty = dict(filter(lambda elem: elem[1] > 5, nlp_counts.items()))

#pprint(nlp_faculty)
#print(len(nlp_faculty))

print("{")
for person in nlp_faculty:
    #print(person)
    if person not in faculty:
        continue
    profile = faculty[person]
    if profile['scholar_profile'] == 'NOSCHOLARPAGE':
        continue
    person_clean = article = re.sub(r' \d+$', '', person)
    print(f'  "{person_clean}": "http://scholar.google.com/citations?user={profile["scholar_profile"]}",')
print("}")
