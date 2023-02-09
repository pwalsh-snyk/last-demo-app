# Our internally managed images for the Juice Shop devs to build upon
# This one is for Node apps

FROM node:12.22-buster

RUN apt-get -y update && apt-get -y install ca-certificates apt-transport-https

RUN echo 'deb     [trusted=yes check-valid-until=no] https://snapshot.debian.org/archive/debian/20211201T215332Z/ buster main \n\
deb-src [trusted=yes check-valid-until=no] https://snapshot.debian.org/archive/debian/20211201T215332Z/ buster main \n\
deb     [trusted=yes check-valid-until=no] https://snapshot.debian.org/archive/debian-security/20211201T215332Z/ buster/updates main \n\
deb-src [trusted=yes check-valid-until=no] https://snapshot.debian.org/archive/debian-security/20211201T215332Z/ buster/updates main' >> /etc/apt/sources.list

RUN apt-get -y update && apt-get -y install \
    liblog4j2-java=2.11.1-2