// Which page a download came from. A resource can sit on more than one page,
// so resource_name alone cannot tell a dual-credit teacher taking a file from
// a K12 page apart from a college instructor taking the same file from the
// book page.
//
// These strings must match ResourceDownload.SOURCES in openstax-cms; anything
// outside that list is rejected by the download-tracking endpoint.
const DownloadSource = {
    bookDetail: 'Book detail',
    k12Subject: 'K12 subject',
    flexPage: 'Flex page'
} as const;

export default DownloadSource;
