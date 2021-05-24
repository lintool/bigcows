import csv
import re
import sys

faculty = {}

with open('csrankings/csrankings.csv', newline='') as f:
    reader = csv.reader(f, delimiter=',', quotechar='\\')
    next(reader)
    for row in reader:
        faculty[row[3]] = row[1]

#print(faculty)

institutions = {}

with open('csrankings/country-info.csv', newline='') as f:
    reader = csv.reader(f, delimiter=',', quotechar='\\')
    next(reader)
    for row in reader:
        institutions[row[0]] = [row[1], row[2]]

#print(institutions)

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
                print(f'    "region": "{institutions[loc][0]}",')
                print(f'    "country": "{institutions[loc][1]}",')
            else:
                print(f'    "region": "usa",')
                print(f'    "country": "usa",')
    else:
        print(line)
