package rs.ac.bg.fon.social_network.auth;

public class VerificationRequest {
    private String username;
    private String verificationCode;

    public VerificationRequest() {
    }

    public VerificationRequest(String username, String verificationCode) {
        this.username = username;
        this.verificationCode = verificationCode;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
}

