import csv
import re
import sys

region_mapping = {'africa': 'Africa',
                  'asia': 'Asia',
                  'australasia': 'Australia',
                  'canada': 'North America',
                  'europe': 'Europe',
                  'southamerica': 'South America'}

faculty = {}

with open('csrankings/csrankings.csv', newline='') as f:
    reader = csv.reader(f, delimiter=',', quotechar='\\')
    next(reader)
    for row in reader:
        faculty[row[3]] = row[1]

#print(faculty)

faculty_corrected = {}

with open('csrankings/nlp-faculty-corrected.csv', newline='') as f:
    reader = csv.reader(f, delimiter=',', quotechar='\\')
    next(reader)
    for row in reader:
        faculty_corrected[row[1]] = [row[0], row[2], row[3]]

#print(faculty_corrected)

institutions = {}

with open('csrankings/country-info.csv', newline='') as f:
    reader = csv.reader(f, delimiter=',', quotechar='\\')
    next(reader)
    for row in reader:
        institutions[row[0]] = [row[1], row[2]]

#print(institutions)

countries = {}

with open('csrankings/countries.csv', newline='') as f:
    reader = csv.reader(f, delimiter=',', quotechar='\\')
    next(reader)
    for row in reader:
        countries[row[1].lower()] = row[0]

#print(countries)

year = None
for line in sys.stdin:
    line = line.rstrip()

    match = re.search(r'http://scholar.google.com/citations\?user=([^"]+)', line)
    if match:
        print(line)
        id = match.group(1)
        if id in faculty:
            loc = faculty[id]
            #print(id + ' ' + loc)
            if loc in institutions:
                print(f'    "region": "{region_mapping[institutions[loc][0]]}",')
                print(f'    "country": "{countries[institutions[loc][1]]}",')
            else:
                print(f'    "region": "North America",')
                print(f'    "country": "United States",')
        elif id in faculty_corrected:
            # Check the list of corrections
            print(f'    "region": "{faculty_corrected[id][1]}",')
            print(f'    "country": "{faculty_corrected[id][2]}",')
    elif line.startswith('    "region":') or line.startswith('    "country"'):
        # Existing annotations, skip.
        pass
    else:
        print(line)
