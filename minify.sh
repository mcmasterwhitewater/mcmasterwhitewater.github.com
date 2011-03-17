rm merged*.css
for f in css/*.css
do
  cat $f >> merged.css
done
java -jar yuicompressor-2.4.2.jar merged.css > merged_min.css

