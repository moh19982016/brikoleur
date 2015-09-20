#!/bin/sh
# Convenience script for building the project using Dojo build utilities.
#
echo Brikolaj...
export BRIKOLEUR_HOME=~psulonen/WebstormProjects
cd ~psulonen/Documents/Code/buildbox/
echo Clearing sandbox
rm -Rf work/
mkdir work
echo Copying resources to source directory
cp $BRIKOLEUR_HOME/brikoleur/src/main/html/index.html ../devbox/
cp -RL ../devbox/*  work
echo Updating build script
cp $BRIKOLEUR_HOME/brikoleur/src/main/assembly/sh/build.sh . # update this file for next time
chmod u+x build.sh
echo Updating profile
cp $BRIKOLEUR_HOME/brikoleur/src/main/assembly/dojo/brikoleur.profile.js work/dojo
cd work/dojo
echo Running Dojo build script
chmod u+x util/buildscripts/build.sh
util/buildscripts/build.sh --profile brikoleur.profile.js
echo Copying assets and index pages into place
cd ../..
mkdir work/package
mkdir work/package/dojo
mv work/release/* work/package/dojo/
mv work/css work/package/
mv work/index.html work/package/
mv work/font-awesome work/package/
#cp -R $BRIKOLEUR_HOME/brikoleur/src/main/assets release/
echo Creating package
zip -r brikoleur.zip work/package/ > /dev/null
echo Done. Release is in directory release/ and a zip package in brikoleur.zip.